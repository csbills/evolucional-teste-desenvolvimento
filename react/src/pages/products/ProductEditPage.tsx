import { Link, useParams, useSearchParams } from 'react-router-dom'

import { ProductForm } from '../../components/products/ProductForm'
import { useProduct } from '../../hooks/products/useProduct'
import { useUpdateProduct } from '../../hooks/products/useProductMutations'
import { parseProductId } from './productDetails'

export function ProductEditPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const productId = parseProductId(id)
  const queryString = searchParams.toString()
  const detailPath =
    productId === null
      ? '/produtos'
      : `/produtos/${productId}${queryString ? `?${queryString}` : ''}`
  const {
    data: product,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useProduct(productId)
  const updateProductMutation = useUpdateProduct()

  if (productId === null) {
    return (
      <div className="space-y-6">
        <Link
          to="/produtos"
          className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          Voltar para produtos
        </Link>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h1 className="text-lg font-semibold text-gray-950">
            Produto não encontrado
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            O identificador informado não é válido.
          </p>
        </section>
      </div>
    )
  }

  if (isLoading) {
    return (
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500" role="status" aria-live="polite">
          Carregando produto...
        </p>
      </section>
    )
  }

  if (isError || !product) {
    return (
      <div className="space-y-6">
        <Link
          to={detailPath}
          className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          Voltar para o produto
        </Link>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h1 className="text-lg font-semibold text-gray-950">
            Não foi possível carregar o produto
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Verifique a conexão com a API e tente novamente.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="mt-4 inline-flex h-9 items-center justify-center rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Tentar novamente
          </button>
        </section>
      </div>
    )
  }

  return (
    <ProductForm
      mode="edit"
      backTo={detailPath}
      initialValues={{
        nome: product.nome,
        categoria: product.categoria,
        preco: String(product.preco),
        estoque: String(product.estoque),
        ativo: product.ativo,
      }}
      isSubmitting={updateProductMutation.isPending}
      onSubmit={(productPayload) =>
        updateProductMutation.mutateAsync({
          id: product.id,
          product: productPayload,
        })
      }
    />
  )
}
