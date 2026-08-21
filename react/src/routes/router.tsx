import { createBrowserRouter, Navigate } from 'react-router-dom'

import { DashboardLayout } from '../layouts/DashboardLayout'
import { ProductsPage } from '../pages/products/ProductsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/produtos" replace />,
      },
      {
        path: 'produtos',
        element: <ProductsPage />,
      },
    ],
  },
])
