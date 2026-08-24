import { createBrowserRouter, Navigate } from 'react-router-dom'

import { DashboardLayout } from '../layouts/DashboardLayout'
import { ProductCreatePage } from '../pages/products/ProductCreatePage'
import { ProductDetailsPage } from '../pages/products/ProductDetailsPage'
import { ProductEditPage } from '../pages/products/ProductEditPage'
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
      {
        path: 'produtos/novo',
        element: <ProductCreatePage />,
      },
      {
        path: 'produtos/:id/editar',
        element: <ProductEditPage />,
      },
      {
        path: 'produtos/:id',
        element: <ProductDetailsPage />,
      },
    ],
  },
])
