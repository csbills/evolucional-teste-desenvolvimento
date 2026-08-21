import { Icons } from '../../components/icons'
import { useProducts } from '../../hooks/products/useProducts'

const categories = [
  { key: 'Perifericos', name: 'Periféricos' },
  { key: 'Monitores', name: 'Monitores' },
  { key: 'Audio', name: 'Áudio' },
  { key: 'Armazenamento', name: 'Armazenamento' },
  { key: 'Componentes', name: 'Componentes' },
  { key: 'Acessorios', name: 'Acessórios' },
]

export function ProductsPage() {
  const { data, isLoading, isError, refetch } = useProducts({
    page: 1,
    limit: 10,
  })

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
              className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          <select
            defaultValue=""
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

        <div className="overflow-x-auto px-5 mt-4">
          <table className="w-full min-w-180 text-left">
            <thead>
              <tr>
                <th className="text-[#101828] text-sm font-semibold leading-5">
                  Produto
                </th>

                <th className="text-[#101828] text-sm font-semibold leading-5">
                  Status
                </th>

                <th className="text-[#101828] text-sm font-semibold leading-5">
                  Categoria
                </th>

                <th className="text-[#101828] text-sm font-semibold leading-5">
                  Preço
                </th>

                <th className="text-[#101828] text-sm font-semibold leading-5">
                  Estoque
                </th>
              </tr>
            </thead>

            <tbody>
              {!isLoading && !isError && data?.data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="flex size-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                        <Icons.Box />
                      </div>

                      <h2 className="mt-4 text-sm font-medium text-gray-900">
                        Nenhum produto encontrado
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Crie seu primeiro produto.
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {data?.data.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-[#ebe6e7] h-[37px]"
                >
                  <td>
                    <span className="text-sm text-[#6a7282]">
                      {product.nome}
                    </span>
                  </td>

                  <td>
                    {product.ativo ? (
                      <span className="text-green-600 border-green-200 border bg-green-100 text-xs font-medium rounded px-2 py-0.5">
                        Ativo
                      </span>
                    ) : (
                      <span className="text-red-600 border-red-200 border bg-red-100 text-xs font-medium rounded px-2 py-0.5">
                        Inativo
                      </span>
                    )}
                  </td>

                  <td>
                    <span className="text-sm text-gray-600">
                      {categories.find(
                        (category) => category.key === product.categoria,
                      )?.name || product.categoria}
                    </span>
                  </td>

                  <td>
                    <span className="text-sm text-gray-600">
                      {product.preco.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </span>
                  </td>

                  <td>
                    <span className="text-sm text-gray-600">
                      {product.estoque}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && !isError && data && (
          <footer className="border-t border-gray-200 px-6 py-4">
            <p className="text-sm text-gray-500">
              {data.total} produto{data.total !== 1 ? 's' : ''}
            </p>
          </footer>
        )}
      </section>
    </div>
  )
}
