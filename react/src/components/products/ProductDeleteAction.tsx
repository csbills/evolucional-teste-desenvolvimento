import { useState } from 'react'

import { useDeleteProduct } from '../../hooks/products/useProductMutations'
import type { Product } from '../../types/product'
import { ProductDeleteDialog } from './ProductDeleteDialog'

interface ProductDeleteActionProps {
  product: Product
}

export function ProductDeleteAction({ product }: ProductDeleteActionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const deleteProductMutation = useDeleteProduct()

  const handleOpen = () => {
    setError(null)
    setIsDialogOpen(true)
  }

  const handleCancel = () => {
    if (!deleteProductMutation.isPending) {
      setIsDialogOpen(false)
    }
  }

  const handleConfirm = async () => {
    setError(null)

    try {
      await deleteProductMutation.mutateAsync(product.id)
      setIsDialogOpen(false)
    } catch {
      setError('Não foi possível excluir o produto. Tente novamente.')
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="text-sm font-medium text-red-600 transition-colors hover:text-red-700 hover:underline focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
      >
        Excluir
      </button>

      <ProductDeleteDialog
        productName={product.nome}
        isOpen={isDialogOpen}
        isDeleting={deleteProductMutation.isPending}
        error={error}
        onCancel={handleCancel}
        onConfirm={() => void handleConfirm()}
      />
    </>
  )
}
