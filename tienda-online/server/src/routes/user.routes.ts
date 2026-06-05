import { Router } from 'express'
import { getAllUsers, updateUser, deleteUser } from '../controllers/user.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { adminMiddleware } from '../middleware/admin.middleware'

const router = Router()

// Actualizar su propio perfil
router.put('/profile', authMiddleware, updateUser)

// Rutas de administración
router.get('/', authMiddleware, adminMiddleware, getAllUsers)
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser)

export default router
