import { Router } from 'express'
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { adminMiddleware } from '../middleware/admin.middleware'

const router = Router()

// Rutas públicas
router.get('/', getAllCategories)

// Rutas protegidas (solo administrador)
router.post('/', authMiddleware, adminMiddleware, createCategory)
router.put('/:id', authMiddleware, adminMiddleware, updateCategory)
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory)

export default router
