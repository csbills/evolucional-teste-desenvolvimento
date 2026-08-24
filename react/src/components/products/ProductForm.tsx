import { useState } from 'react'
import { Link } from 'react-router-dom'

import {
  emptyProductFormValues,
  type ProductFormErrors,
  type ProductFormValues,
  productCategories,
  toProductPayload,
  validateProductForm,
} from '../../pages/products/productForm'
import type { ProductPayload } from '../../types/product'

interface ProductFormProps {
  mode: 'create' | 'edit'
  backTo: string
  initialValues?: ProductFormValues
  isSubmitting: boolean
  onSubmit: (product: ProductPayload) => Promise<unknown>
}

const inputClassName = (hasError: boolean) =>
  `mt-2 h-10 w-full rounded-lg border bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 ${
    hasError
      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
      : 'border-gray-300 focus:border-gray-400 focus:ring-gray-100'
  }`

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null
  }

  return (
    <p id={id} className="mt-1 text-sm text-red-600" role="alert">
      {message}
    </p>
  )
}

export function ProductForm({
  mode,
  backTo,
  initialValues,
  isSubmitting,
  onSubmit,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(
    () => initialValues ?? emptyProductFormValues,
  )
  const [errors, setErrors] = useState<ProductFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const isEdit = mode === 'edit'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateProductForm(values)
    setErrors(nextErrors)
    setSubmitError(null)
    setSuccessMessage(null)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    try {
      await onSubmit(toProductPayload(values))
      setSuccessMessage(
        isEdit
          ? 'Produto atualizado com sucesso.'
          : 'Produto criado com sucesso.',
      )
    } catch {
      setSubmitError(
        isEdit
          ? 'Não foi possível atualizar o produto. Tente novamente.'
          : 'Não foi possível criar o produto. Tente novamente.',
      )
    }
  }

  const handleValueChange = <K extends keyof ProductFormValues>(
    field: K,
    value: ProductFormValues[K],
  ) => {
    setValues((currentValues) => ({ ...currentValues, [field]: value }))
    setErrors((currentErrors) => {
      if (!currentErrors[field as keyof ProductFormErrors]) {
        return currentErrors
      }

      const nextValues = { ...values, [field]: value }
      const nextErrors = validateProductForm(nextValues)
      const updatedErrors = { ...currentErrors }

      if (nextErrors[field as keyof ProductFormErrors]) {
        updatedErrors[field as keyof ProductFormErrors] =
          nextErrors[field as keyof ProductFormErrors]
      } else {
        delete updatedErrors[field as keyof ProductFormErrors]
      }

      return updatedErrors
    })
    setSubmitError(null)
    setSuccessMessage(null)
  }

  const title = isEdit ? 'Editar produto' : 'Novo produto'
  const description = isEdit
    ? 'Atualize os dados do produto no catálogo.'
    : 'Cadastre um novo produto no catálogo.'
  const submitLabel = isEdit ? 'Salvar alterações' : 'Criar produto'

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={backTo}
          className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          Voltar
        </Link>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-gray-950">
          {title}
        </h1>

        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
        {successMessage && (
          <div
            className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            role="status"
            aria-live="polite"
          >
            {successMessage}
          </div>
        )}

        {submitError && (
          <div
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {submitError}
          </div>
        )}

        <form
          className="space-y-6"
          noValidate
          aria-busy={isSubmitting}
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="product-name"
                className="text-sm font-medium text-gray-800"
              >
                Nome
              </label>
              <input
                id="product-name"
                name="nome"
                type="text"
                autoComplete="off"
                value={values.nome}
                onChange={(event) =>
                  handleValueChange('nome', event.target.value)
                }
                aria-invalid={Boolean(errors.nome)}
                aria-describedby={
                  errors.nome ? 'product-name-error' : undefined
                }
                className={inputClassName(Boolean(errors.nome))}
                disabled={isSubmitting}
              />
              <FieldError id="product-name-error" message={errors.nome} />
            </div>

            <div>
              <label
                htmlFor="product-category"
                className="text-sm font-medium text-gray-800"
              >
                Categoria
              </label>
              <select
                id="product-category"
                name="categoria"
                value={values.categoria}
                onChange={(event) =>
                  handleValueChange('categoria', event.target.value)
                }
                aria-invalid={Boolean(errors.categoria)}
                aria-describedby={
                  errors.categoria ? 'product-category-error' : undefined
                }
                className={inputClassName(Boolean(errors.categoria))}
                disabled={isSubmitting}
              >
                <option value="">Selecione uma categoria</option>
                {productCategories.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.name}
                  </option>
                ))}
              </select>
              <FieldError
                id="product-category-error"
                message={errors.categoria}
              />
            </div>

            <div>
              <label
                htmlFor="product-price"
                className="text-sm font-medium text-gray-800"
              >
                Preço
              </label>
              <input
                id="product-price"
                name="preco"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                placeholder="0,00"
                value={values.preco}
                onChange={(event) =>
                  handleValueChange('preco', event.target.value)
                }
                aria-invalid={Boolean(errors.preco)}
                aria-describedby={
                  errors.preco ? 'product-price-error' : undefined
                }
                className={inputClassName(Boolean(errors.preco))}
                disabled={isSubmitting}
              />
              <FieldError id="product-price-error" message={errors.preco} />
            </div>

            <div>
              <label
                htmlFor="product-stock"
                className="text-sm font-medium text-gray-800"
              >
                Estoque
              </label>
              <input
                id="product-stock"
                name="estoque"
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                placeholder="0"
                value={values.estoque}
                onChange={(event) =>
                  handleValueChange('estoque', event.target.value)
                }
                aria-invalid={Boolean(errors.estoque)}
                aria-describedby={
                  errors.estoque ? 'product-stock-error' : undefined
                }
                className={inputClassName(Boolean(errors.estoque))}
                disabled={isSubmitting}
              />
              <FieldError id="product-stock-error" message={errors.estoque} />
            </div>

            <div className="flex items-start gap-3 sm:col-span-2">
              <input
                id="product-active"
                name="ativo"
                type="checkbox"
                checked={values.ativo}
                onChange={(event) =>
                  handleValueChange('ativo', event.target.checked)
                }
                className="mt-0.5 size-4 rounded border-gray-300 accent-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                disabled={isSubmitting}
              />
              <div>
                <label
                  htmlFor="product-active"
                  className="text-sm font-medium text-gray-800"
                >
                  Produto ativo
                </label>
                <p className="mt-1 text-sm text-gray-500">
                  Produtos inativos não ficam disponíveis no catálogo.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
            <Link
              to={backTo}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-gray-900 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : submitLabel}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
