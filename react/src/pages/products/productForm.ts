import type { ProductPayload } from '../../types/product'

export interface ProductFormValues {
  nome: string
  categoria: string
  preco: string
  estoque: string
  ativo: boolean
}

export type ProductFormErrors = Partial<
  Record<keyof Omit<ProductFormValues, 'ativo'>, string>
>

export const productCategories = [
  { key: 'Perifericos', name: 'Periféricos' },
  { key: 'Monitores', name: 'Monitores' },
  { key: 'Audio', name: 'Áudio' },
  { key: 'Armazenamento', name: 'Armazenamento' },
  { key: 'Componentes', name: 'Componentes' },
  { key: 'Acessorios', name: 'Acessórios' },
]

export const emptyProductFormValues: ProductFormValues = {
  nome: '',
  categoria: '',
  preco: '',
  estoque: '',
  ativo: true,
}

export function validateProductForm(
  values: ProductFormValues,
): ProductFormErrors {
  const errors: ProductFormErrors = {}
  const name = values.nome.trim()
  const price = Number(values.preco)
  const stock = Number(values.estoque)

  if (!name) {
    errors.nome = 'Nome é obrigatório.'
  } else if (name.length < 3) {
    errors.nome = 'Nome deve ter pelo menos 3 caracteres.'
  }

  if (!values.categoria) {
    errors.categoria = 'Categoria é obrigatória.'
  }

  if (!values.preco.trim()) {
    errors.preco = 'Preço é obrigatório.'
  } else if (!Number.isFinite(price) || price <= 0) {
    errors.preco = 'Preço deve ser maior que zero.'
  }

  if (!values.estoque.trim()) {
    errors.estoque = 'Estoque é obrigatório.'
  } else if (!Number.isFinite(stock) || stock < 0) {
    errors.estoque = 'Estoque deve ser zero ou maior.'
  }

  return errors
}

export function toProductPayload(values: ProductFormValues): ProductPayload {
  return {
    nome: values.nome.trim(),
    categoria: values.categoria,
    preco: Number(values.preco),
    estoque: Number(values.estoque),
    ativo: values.ativo,
  }
}
