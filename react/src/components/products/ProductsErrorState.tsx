interface ProductsErrorStateProps {
  isRetrying: boolean
  onRetry: () => void
}

export function ProductsErrorState({
  isRetrying,
  onRetry,
}: ProductsErrorStateProps) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center">
      <h2 className="text-sm font-medium text-gray-900">
        Não foi possível carregar os produtos
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Verifique a conexão com a API e tente novamente.
      </p>

      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="mt-4 inline-flex h-9 items-center justify-center rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Tentar novamente
      </button>
    </div>
  )
}
