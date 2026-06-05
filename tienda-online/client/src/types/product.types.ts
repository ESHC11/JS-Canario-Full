// ── Tipos de Producto ──

export interface Category {
  id: string
  name: string
  slug: string
}

export interface ProductVariant {
  id: string
  productId: string
  sku: string
  size?: string
  color?: string
  storage?: string
  price?: number
  stock: number
}

export interface Product {
  id: string
  name: string
  description?: string
  slug: string
  basePrice: number
  images: string[]
  categoryId: string
  category?: Category
  variants?: ProductVariant[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}
