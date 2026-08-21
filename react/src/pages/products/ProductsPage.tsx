import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  DataTable,
  type DataTableColumn,
} from '../../components/data-table/DataTable'
import { DataTablePagination } from '../../components/data-table/DataTablePagination'
import { Icons } from '../../components/icons'
import { ProductsEmptyState } from '../../components/products/ProductsEmptyState'
import { ProductsErrorState } from '../../components/products/ProductsErrorState'
import { useProducts } from '../../hooks/products/useProducts'
import type { Product } from '../../types/product'
import {
  PRODUCTS_PAGE_SIZE,
  parseProductSearchParams,
  updateProductSearchParams,
} from './productsPagination'

const categories = [
  { key: 'Perifericos', name: 'Periféricos' },
  { key: 'Monitores', name: 'Monitores' },
  { key: 'Audio', name: 'Áudio' },
  { key: 'Armazenamento', name: 'Armazenamento' },
  { key: 'Componentes', name: 'Componentes' },
  { key: 'Acessorios', name: 'Acessórios' },
]

const productColumns: DataTableColumn<Product>[] = [
  {
    key: 'name',
    header: 'Produto',
    render: (product) => (
      <span className="text-sm text-[#6a7282]">{product.nome}</span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (product) =>
      product.ativo ? (
        <span className="rounded border border-green-200 bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
          Ativo
        </span>
      ) : (
        <span className="rounded border border-red-200 bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
          Inativo
        </span>
      ),
  },
  {
    key: 'category',
    header: 'Categoria',
    render: (product) => (
      <span className="text-sm text-gray-600">
        {categories.find((category) => category.key === product.categoria)
          ?.name || product.categoria}
      </span>
    ),
  },
  {
    key: 'price',
    header: 'Preço',
    render: (product) => (
      <span className="text-sm text-gray-600">
        {product.preco.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </span>
    ),
  },
  {
    key: 'stock',
    header: 'Estoque',
    render: (product) => (
      <span className="text-sm text-gray-600">{product.estoque}</span>
    ),
  },
]

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { page, search, category } = parseProductSearchParams(searchParams)
  const { data, isLoading, isFetching, isError, refetch } = useProducts({
    page,
    limit: PRODUCTS_PAGE_SIZE,
    search,
    category,
  })

  const hasFilters = Boolean(search || category)

  useEffect(() => {
    if (!data) {
      return
    }

    const lastAvailablePage = Math.max(data.totalPages, 1)

    if (page > lastAvailablePage) {
      setSearchParams(
        updateProductSearchParams(searchParams, { page: lastAvailablePage }),
        { replace: true },
      )
    }
  }, [data, page, searchParams, setSearchParams])

  const handlePageChange = (nextPage: number) => {
    setSearchParams(updateProductSearchParams(searchParams, { page: nextPage }))
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-950">
            Produtos
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Gerencie os produtos disponíveis no seu catálogo.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          <Icons.Plus />
          Novo produto
        </button>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Icons.Search />
            <input
              type="search"
              placeholder="Buscar por nome..."
              aria-label="Buscar produtos por nome"
              value={search ?? ''}
              onChange={(event) => {
                setSearchParams(
                  updateProductSearchParams(searchParams, {
                    search: event.target.value,
                  }),
                  { replace: true },
                )
              }}
              className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          <select
            aria-label="Filtrar produtos por categoria"
            value={category ?? ''}
            onChange={(event) => {
              setSearchParams(
                updateProductSearchParams(searchParams, {
                  category: event.target.value,
                }),
                { replace: true },
              )
            }}
            className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 sm:w-52"
          >
            <option value="">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category.key} value={category.key}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <DataTable
          columns={productColumns}
          data={data?.data ?? []}
          getRowKey={(product) => product.id}
          isLoading={isLoading}
          isError={isError}
          isFetching={isFetching}
          emptyState={<ProductsEmptyState hasFilters={hasFilters} />}
          errorState={
            <ProductsErrorState
              isRetrying={isFetching}
              onRetry={() => void refetch()}
            />
          }
        />

        {!isLoading && !isError && data && (
          <DataTablePagination
            page={page}
            displayedPage={data.page}
            total={data.total}
            limit={data.limit}
            totalPages={data.totalPages}
            isFetching={isFetching}
            itemLabel="produto"
            ariaLabel="Paginação de produtos"
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </div>
  )
}
