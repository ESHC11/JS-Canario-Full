import { Router } from 'express'
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from '../controllers/order.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { adminMiddleware } from '../middleware/admin.middleware'

const router = Router()

// Rutas del cliente (requieren autenticación)
router.post('/', authMiddleware, createOrder)
router.get('/my-orders', authMiddleware, getUserOrders)

// Rutas del administrador
router.get('/', authMiddleware, adminMiddleware, getAllOrders)
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus)

export default router
