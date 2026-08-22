import { useQuery } from '@tanstack/react-query'
import { getProductById } from '../../services/product.service'

export function useProduct(id: number | null) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id as number),
    enabled: id !== null,
  })
}
