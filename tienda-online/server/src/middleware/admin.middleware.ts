import { Request, Response, NextFunction } from 'express'

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({ message: 'Acceso denegado: solo administradores' })
    return
  }
  next()
}
