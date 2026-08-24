import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ProductPayload } from '../../types/product'
import { ProductForm } from './ProductForm'

afterEach(() => {
  cleanup()
})

function renderProductForm(
  onSubmit: (product: ProductPayload) => Promise<unknown>,
) {
  return render(
    <MemoryRouter>
      <ProductForm
        mode="create"
        backTo="/produtos"
        isSubmitting={false}
        onSubmit={onSubmit}
      />
    </MemoryRouter>,
  )
}

describe('ProductForm', () => {
  it('exibe os erros de validação ao enviar o formulário vazio', () => {
    const onSubmit = vi.fn<(product: ProductPayload) => Promise<unknown>>()

    renderProductForm(onSubmit)

    fireEvent.click(screen.getByRole('button', { name: 'Criar produto' }))

    expect(screen.getByText('Nome é obrigatório.')).toBeTruthy()
    expect(screen.getByText('Categoria é obrigatória.')).toBeTruthy()
    expect(screen.getByText('Preço é obrigatório.')).toBeTruthy()
    expect(screen.getByText('Estoque é obrigatório.')).toBeTruthy()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('envia os dados válidos convertidos para o payload do produto', async () => {
    const onSubmit = vi
      .fn<(product: ProductPayload) => Promise<unknown>>()
      .mockResolvedValue(undefined)

    renderProductForm(onSubmit)

    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: '  Teclado mecânico  ' },
    })
    fireEvent.change(screen.getByLabelText('Categoria'), {
      target: { value: 'Perifericos' },
    })
    fireEvent.change(screen.getByLabelText('Preço'), {
      target: { value: '199.90' },
    })
    fireEvent.change(screen.getByLabelText('Estoque'), {
      target: { value: '4' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Criar produto' }))

    expect(onSubmit).toHaveBeenCalledWith({
      nome: 'Teclado mecânico',
      categoria: 'Perifericos',
      preco: 199.9,
      estoque: 4,
      ativo: true,
    })
    expect(await screen.findByText('Produto criado com sucesso.')).toBeTruthy()
  })
})
