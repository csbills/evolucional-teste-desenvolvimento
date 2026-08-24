import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createProduct,
  deleteProduct,
  updateProduct,
} from '../../services/product.service'
import type { ProductPayload } from '../../types/product'

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (product: ProductPayload) => createProduct(product),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, product }: { id: number; product: ProductPayload }) =>
      updateProduct(id, product),
    onSuccess: (product) => {
      queryClient.setQueryData(['product', product.id], product)
      void queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: ['product', id] })
      void queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
