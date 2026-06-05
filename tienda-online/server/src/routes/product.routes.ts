import { Router } from 'express'
import { getAllProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { adminMiddleware } from '../middleware/admin.middleware'

const router = Router()

// Rutas públicas
router.get('/', getAllProducts)
router.get('/:slug', getProductBySlug)

// Rutas protegidas (solo administrador)
router.post('/', authMiddleware, adminMiddleware, createProduct)
router.put('/:id', authMiddleware, adminMiddleware, updateProduct)
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct)

export default router
