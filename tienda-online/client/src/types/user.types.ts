// ── Tipos de Usuario ──

export interface Address {
  id: string
  userId: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'CUSTOMER' | 'ADMIN'
  address?: Address
  createdAt?: string
}

export interface AuthResponse {
  message: string
  token: string
  user: User
}
