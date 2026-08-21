import { Outlet } from 'react-router-dom'

import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="lg:pl-64">
        <Header />

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
