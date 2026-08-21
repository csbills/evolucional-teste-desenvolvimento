const API_URL = import.meta.env.VITE_API_URL

export interface ApiResponse<T> {
  data: T
  status: number
  headers: Headers
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function api<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`Falha ao acessar a API: ${response.status}`)
  }

  const data = (await response.json()) as T

  return {
    data,
    status: response.status,
    headers: response.headers,
  }
}
