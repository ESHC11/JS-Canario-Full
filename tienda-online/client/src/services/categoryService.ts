import api from './api'
import type { Category } from '../types'

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const { data } = await api.get('/categories')
    return data.data
  },

  async create(name: string) {
    const { data } = await api.post('/categories', { name })
    return data
  },

  async update(id: string, name: string) {
    const { data } = await api.put(`/categories/${id}`, { name })
    return data
  },

  async delete(id: string) {
    const { data } = await api.delete(`/categories/${id}`)
    return data
  },
}
