import { useEffect, useRef } from 'react'

import { getDeleteConfirmationCopy } from './productDelete'

interface ProductDeleteDialogProps {
  productName: string
  isOpen: boolean
  isDeleting: boolean
  error: string | null
  onCancel: () => void
  onConfirm: () => void
}

export function ProductDeleteDialog({
  productName,
  isOpen,
  isDeleting,
  error,
  onCancel,
  onConfirm,
}: ProductDeleteDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      cancelButtonRef.current?.focus()
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <div className="absolute inset-0 bg-gray-950/40" aria-hidden="true" />

      <section
        className="relative w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-product-title"
        aria-describedby="delete-product-description"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && !isDeleting) {
            onCancel()
          }
        }}
      >
        <h2
          id="delete-product-title"
          className="text-lg font-semibold text-gray-950"
        >
          Excluir produto
        </h2>

        <p
          id="delete-product-description"
          className="mt-2 text-sm leading-6 text-gray-600"
        >
          {getDeleteConfirmationCopy(productName)}
        </p>

        {error && (
          <p
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir produto'}
          </button>
        </div>
      </section>
    </div>
  )
}
