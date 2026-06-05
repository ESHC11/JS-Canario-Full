import api from './api'
import type { Order } from '../types'

export const orderService = {
  async create(items: any[], shippingAddress: Record<string, string>): Promise<Order> {
    const { data } = await api.post('/orders', { items, shippingAddress })
    return data.data
  },

  async getUserOrders(): Promise<Order[]> {
    const { data } = await api.get('/orders/my-orders')
    return data.data
  },

  async getAll(): Promise<Order[]> {
    const { data } = await api.get('/orders')
    return data.data
  },

  async updateStatus(id: string, status: string) {
    const { data } = await api.put(`/orders/${id}/status`, { status })
    return data
  },
}
