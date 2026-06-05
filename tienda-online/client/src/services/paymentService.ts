import api from './api'

export const paymentService = {
  async createCheckoutSession(orderId: string): Promise<{ url: string }> {
    const { data } = await api.post('/payments/create-checkout-session', { orderId })
    return data
  },
}
