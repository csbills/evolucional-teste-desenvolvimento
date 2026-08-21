export type PaginationItem = number | 'ellipsis'

export interface PaginationRange {
  from: number
  to: number
}

export function getPaginationRange(
  page: number,
  total: number,
  limit: number,
): PaginationRange {
  if (total <= 0 || limit <= 0) {
    return { from: 0, to: 0 }
  }

  const normalizedPage = Math.max(page, 1)
  const from = (normalizedPage - 1) * limit + 1
  const to = Math.min(normalizedPage * limit, total)

  return from > to ? { from: 0, to: 0 } : { from, to }
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
