// ── Tipos de Orden ──

import type { ProductVariant, Product } from './product.types'

export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'

export interface OrderItem {
  id: string
  orderId: string
  variantId: string
  variant?: ProductVariant & { product?: Product }
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  total: number
  status: OrderStatus
  stripePaymentId?: string
  shippingAddress: Record<string, string>
  createdAt: string
  updatedAt: string
}
