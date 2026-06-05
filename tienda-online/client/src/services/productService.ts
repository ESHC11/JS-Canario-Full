import api from './api'
import type { Product } from '../types'

export const productService = {
  async getAll(): Promise<Product[]> {
    const { data } = await api.get('/products')
    return data.data
  },

  async getBySlug(slug: string): Promise<Product> {
    const { data } = await api.get(`/products/${slug}`)
    return data.data
  },

  async create(productData: Partial<Product>) {
    const { data } = await api.post('/products', productData)
    return data
  },

  async update(id: string, productData: Partial<Product>) {
    const { data } = await api.put(`/products/${id}`, productData)
    return data
  },

  async delete(id: string) {
    const { data } = await api.delete(`/products/${id}`)
    return data
  },
}
