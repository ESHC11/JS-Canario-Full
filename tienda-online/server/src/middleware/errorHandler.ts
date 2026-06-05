import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('❌ Error:', err.message)

  // Error de Prisma: registro duplicado
  if (err.message.includes('Unique constraint')) {
    res.status(400).json({ message: 'El registro ya existe' })
    return
  }

  res.status(500).json({ message: err.message || 'Error interno del servidor' })
}
