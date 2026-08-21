import type { Key, ReactNode } from 'react'

export interface DataTableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  getRowKey: (row: T) => Key
  isLoading: boolean
  isError: boolean
  isFetching?: boolean
  emptyState?: ReactNode
  errorState?: ReactNode
}

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  isLoading,
  isError,
  isFetching = false,
  emptyState = 'Nenhum registro encontrado.',
  errorState = 'Não foi possível carregar os dados.',
}: DataTableProps<T>) {
  return (
    <div className="mt-4 overflow-x-auto px-5">
      <table className="w-full min-w-180 text-left" aria-busy={isFetching}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="text-[#101828] text-sm font-semibold leading-5"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading && !data.length && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-16 text-center">
                <p
                  className="text-sm text-gray-500"
                  role="status"
                  aria-live="polite"
                >
                  Carregando dados...
                </p>
              </td>
            </tr>
          )}

          {isError && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-16 text-center">
                {errorState}
              </td>
            </tr>
          )}

          {!isLoading && !isError && data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-16 text-center">
                {emptyState}
              </td>
            </tr>
          )}

          {!isError &&
            data.map((row) => (
              <tr
                key={getRowKey(row)}
                className="h-[37px] border-b border-[#ebe6e7]"
              >
                {columns.map((column) => (
                  <td key={column.key}>{column.render(row)}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
