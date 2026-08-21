export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-end border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-gray-900">Administrador</p>
          <p className="text-xs text-gray-500">Gerenciamento</p>
        </div>

        <div className="flex size-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
          A
        </div>
      </div>
    </header>
  )
}
