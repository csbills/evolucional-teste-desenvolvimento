export function ProductsPage() {
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
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="size-4"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 5v14M5 12h14"
            />
          </svg>
          Novo produto
        </button>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row">
          <div className="relative flex-1">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="m20 20-4-4" />
            </svg>

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
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-180 text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70">
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Produto
                </th>

                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Categoria
                </th>

                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Preço
                </th>

                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Estoque
                </th>

                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center">
                    <div className="flex size-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        className="size-6"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20 7 12 3 4 7m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
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
            </tbody>
          </table>
        </div>

        <footer className="flex flex-col justify-between gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center">
          <p className="text-sm text-gray-500">0 produtos</p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled
              className="inline-flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>

            <button
              type="button"
              disabled
              className="inline-flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </footer>
      </section>
    </div>
  )
}
