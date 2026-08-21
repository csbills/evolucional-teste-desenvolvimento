import { Icons } from '../icons'
import { getProductsEmptyStateMessage } from './productTableStates'

interface ProductsEmptyStateProps {
  hasFilters: boolean
}

export function ProductsEmptyState({ hasFilters }: ProductsEmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        <Icons.Box />
      </div>

      <h2 className="mt-4 text-sm font-medium text-gray-900">
        Nenhum produto encontrado
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        {getProductsEmptyStateMessage(hasFilters)}
      </p>
    </div>
  )
}
