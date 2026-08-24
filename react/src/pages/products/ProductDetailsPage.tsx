import { Link, useParams, useSearchParams } from 'react-router-dom'

import { useProduct } from '../../hooks/products/useProduct'
import { parseProductId } from './productDetails'

const categoryNames: Record<string, string> = {
  Acessorios: 'Acessórios',
  Armazenamento: 'Armazenamento',
  Audio: 'Áudio',
  Componentes: 'Componentes',
  Monitores: 'Monitores',
  Perifericos: 'Periféricos',
}

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const productId = parseProductId(id)
  const queryString = searchParams.toString()
  const productsPath = `/produtos${queryString ? `?${queryString}` : ''}`
  const editPath =
    productId === null
      ? '/produtos'
      : `/produtos/${productId}/editar${queryString ? `?${queryString}` : ''}`
  const {
    data: product,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useProduct(productId)

  return (
    <div className="space-y-6">
      <Link
        to={productsPath}
        className="inline-flex text-sm font-medium text-gray-600 transition-colors hover:text-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
      >
        Voltar para produtos
      </Link>

      {productId === null && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h1 className="text-lg font-semibold text-gray-950">
            Produto não encontrado
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            O identificador informado não é válido.
          </p>
        </section>
      )}

      {productId !== null && isLoading && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500" role="status" aria-live="polite">
            Carregando produto...
          </p>
        </section>
      )}

      {productId !== null && isError && (
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
      )}

      {productId !== null && !isLoading && !isError && product && (
        <section className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
          <header className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-start">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-950">
                {product.nome}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Detalhes completos do produto.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={editPath}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Editar produto
              </Link>

              {product.ativo ? (
                <span className="w-fit rounded border border-green-200 bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
                  Ativo
                </span>
              ) : (
                <span className="w-fit rounded border border-red-200 bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                  Inativo
                </span>
              )}
            </div>
          </header>

          <dl className="grid grid-cols-1 gap-x-6 gap-y-6 pt-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                ID
              </dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">
                {product.id}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Categoria
              </dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">
                {categoryNames[product.categoria] || product.categoria}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Preço
              </dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">
                {product.preco.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Estoque
              </dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">
                {product.estoque}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Status
              </dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">
                {product.ativo ? 'Ativo' : 'Inativo'}
              </dd>
            </div>
          </dl>
        </section>
      )}
    </div>
  )
}
