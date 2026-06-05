import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares globales
app.use(cors({ origin: process.env.CLIENT_URL }))

// Body parser
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))
app.use(express.json())

// Rutas de la API
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/users', userRoutes)

// Middlewares de manejo de errores
app.use(errorHandler)

// Iniciar servidor solo si no estamos en Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`)
    })
}

export default app