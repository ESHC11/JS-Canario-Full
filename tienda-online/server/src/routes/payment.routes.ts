import { Router } from 'express'
import { createCheckoutSession, stripeWebhook } from '../controllers/payment.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// Iniciar pago de una orden
router.post('/create-checkout-session', authMiddleware, createCheckoutSession)

// Webhook de Stripe (debe recibir el body como raw, no json, por lo que esto se maneja en app.ts normalmente o con un middleware específico)
// Aquí la definimos pero la configuración del body-parser dependerá del app.ts
router.post('/webhook', stripeWebhook)

export default router
