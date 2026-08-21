import { Icons } from '../icons'
import { getPaginationItems, getPaginationRange } from './paginationUtils'

export interface DataTablePaginationProps {
  page: number
  displayedPage?: number
  total: number
  limit: number
  totalPages: number
  isFetching?: boolean
  itemLabel?: string
  ariaLabel?: string
  onPageChange: (page: number) => void
}

export function DataTablePagination({
  page,
  displayedPage = page,
  total,
  limit,
  totalPages,
  isFetching = false,
  itemLabel = 'item',
  ariaLabel = 'Paginação',
  onPageChange,
}: DataTablePaginationProps) {
  const { from, to } = getPaginationRange(displayedPage, total, limit)
  const paginationItems = getPaginationItems(page, totalPages)
  let ellipsisCount = 0

  return (
    <footer className="flex flex-col gap-4 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-500">
          Mostrando {from}–{to} de {total} {itemLabel}
          {total !== 1 ? 's' : ''}
        </p>

        {isFetching && (
          <span
            className="text-xs text-gray-400"
            role="status"
            aria-live="polite"
          >
            Atualizando...
          </span>
        )}
      </div>

      {totalPages > 1 && (
        <nav className="flex items-center gap-1" aria-label={ariaLabel}>
          <button
            type="button"
            aria-label="Ir para a página anterior"
            disabled={page === 1 || isFetching}
            onClick={() => onPageChange(page - 1)}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icons.ChevronLeft />
          </button>

          {paginationItems.map((item) => {
            if (item === 'ellipsis') {
              ellipsisCount += 1

              return (
                <span
                  key={`ellipsis-${ellipsisCount}`}
                  className="inline-flex size-9 items-center justify-center text-sm text-gray-400"
                  aria-hidden="true"
                >
                  …
                </span>
              )
            }

            return (
              <button
                key={item}
                type="button"
                aria-label={`Ir para a página ${item}`}
                aria-current={item === page ? 'page' : undefined}
                disabled={item === page || isFetching}
                onClick={() => onPageChange(item)}
                className={[
                  'inline-flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed',
                  item === page
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-60',
                ].join(' ')}
              >
                {item}
              </button>
            )
          })}

          <button
            type="button"
            aria-label="Ir para a próxima página"
            disabled={page === totalPages || isFetching}
            onClick={() => onPageChange(page + 1)}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icons.ChevronRight />
          </button>
        </nav>
      )}
    </footer>
  )
}
