import { Router, Request, Response } from 'express'
import { upload } from '../middleware/upload.middleware'
import { uploadBufferToCloudinary } from '../config/cloudinary'
import { authMiddleware } from '../middleware/auth.middleware'
import { adminMiddleware } from '../middleware/admin.middleware'

const router = Router()

router.post('/', authMiddleware, adminMiddleware, upload.single('image'), async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No se subió ninguna imagen' })
            return
        }

        const imageUrl = await uploadBufferToCloudinary(req.file.buffer)
        res.status(200).json({ success: true, url: imageUrl })
    } catch (error) {
        console.error('Error al subir imagen:', error)
        res.status(500).json({ message: 'Error al subir imagen a Cloudinary' })
    }
})

export default router
