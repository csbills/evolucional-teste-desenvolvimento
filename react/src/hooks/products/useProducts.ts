import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../../services/product.service'

interface UseProductsParams {
  page: number
  limit: number
  search?: string
  category?: string
}

export function useProducts(params: UseProductsParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
  })
}
