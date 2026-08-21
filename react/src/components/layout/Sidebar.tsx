import { NavLink } from 'react-router-dom'

const navigation = [
  {
    name: 'Produtos',
    path: '/produtos',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="size-5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 7 12 3 4 7m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
  },
]

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-gray-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-gray-900 text-sm font-semibold text-white">
            E
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">E-commerce</p>
            <p className="text-xs text-gray-500">Painel administrativo</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6">
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-gray-400">
          Gerenciamento
        </p>

        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-gray-100 text-gray-950'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950',
                  ].join(' ')
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-gray-200 p-4">
        <p className="text-xs text-gray-400">Painel de gerenciamento</p>
      </div>
    </aside>
  )
}
