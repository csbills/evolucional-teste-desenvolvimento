import { ProductForm } from '../../components/products/ProductForm'
import { useCreateProduct } from '../../hooks/products/useProductMutations'

export function ProductCreatePage() {
  const createProductMutation = useCreateProduct()

  return (
    <ProductForm
      mode="create"
      backTo="/produtos"
      isSubmitting={createProductMutation.isPending}
      onSubmit={(product) => createProductMutation.mutateAsync(product)}
    />
  )
}
