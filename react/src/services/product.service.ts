import { api, type PaginatedResponse } from '../api/api'
import type { Product } from '../types/product'

interface GetProductsParams {
  page: number
  limit: number
  search?: string
  category?: string
}

export async function getProducts({
  page,
  limit,
  search,
  category,
}: GetProductsParams): Promise<PaginatedResponse<Product>> {
  const params = new URLSearchParams({
    _page: String(page),
    _limit: String(limit),
  })

  if (search) {
    params.set('nome_like', search)
  }

  if (category) {
    params.set('categoria', category)
  }

  const response = await api<Product[]>(`/produtos?${params.toString()}`)

  const total = Number(response.headers.get('X-Total-Count') || 0)

  return {
    data: response.data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}
