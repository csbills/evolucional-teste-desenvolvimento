export const PRODUCTS_PAGE_SIZE = 10

export interface ProductSearchState {
  page: number
  search?: string
  category?: string
}

export type ProductSearchParamChanges = Partial<
  Pick<ProductSearchState, 'page' | 'search' | 'category'>
>

export type PaginationItem = number | 'ellipsis'

function getOptionalParam(params: URLSearchParams, key: string) {
  const value = params.get(key)?.trim()

  return value || undefined
}

export function parseProductSearchParams(
  params: URLSearchParams,
): ProductSearchState {
  const parsedPage = Number(params.get('page'))
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1

  return {
    page,
    search: getOptionalParam(params, 'search'),
    category: getOptionalParam(params, 'category'),
  }
}

export function updateProductSearchParams(
  currentParams: URLSearchParams,
  changes: ProductSearchParamChanges,
) {
  const nextParams = new URLSearchParams(currentParams)
  const filterChanged = 'search' in changes || 'category' in changes

  if (filterChanged) {
    nextParams.set('page', '1')
  }

  if ('page' in changes && changes.page !== undefined) {
    const page =
      Number.isInteger(changes.page) && changes.page > 0 ? changes.page : 1

    nextParams.set('page', String(page))
  }

  if ('search' in changes) {
    const search = changes.search?.trim()

    if (search) {
      nextParams.set('search', search)
    } else {
      nextParams.delete('search')
    }
  }

  if ('category' in changes) {
    const category = changes.category?.trim()

    if (category) {
      nextParams.set('category', category)
    } else {
      nextParams.delete('category')
    }
  }

  return nextParams
}

export function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 0) {
    return []
  }

  const page = Math.min(Math.max(currentPage, 1), totalPages)

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (page <= 3) {
    return [1, 2, 3, 4, 'ellipsis', totalPages]
  }

  if (page >= totalPages - 2) {
    return [
      1,
      'ellipsis',
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
  }

  return [1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages]
}
