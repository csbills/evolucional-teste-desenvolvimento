export interface Product {
  id: number
  nome: string
  categoria: string
  preco: number
  estoque: number
  ativo: boolean
}

export type ProductPayload = Omit<Product, 'id'>
