import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// ─── Registro de usuario ──────────────────────────────
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body

    // Validar que todos los campos existan
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Todos los campos son obligatorios' })
      return
    }

    // Verificar que el email no esté registrado
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      res.status(400).json({ message: 'El email ya está registrado' })
      return
    }

    // Hashear la contraseña (después de validar)
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear el usuario en la BD
    const userCount = await prisma.user.count()
    const assignedRole = userCount === 0 ? 'ADMIN' : 'CUSTOMER'
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: assignedRole,
      },
    })

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Responder con el token y datos del usuario (sin contraseña)
    res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

// ─── Login ────────────────────────────────────────────
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ message: 'Todos los campos son obligatorios' })
      return
    }

    // Buscar al usuario por email
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      res.status(401).json({ message: 'Credenciales incorrectas' })
      return
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(401).json({ message: 'Credenciales incorrectas' })
      return
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

// ─── Obtener perfil del usuario autenticado ───────────
export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { address: true },
    })

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' })
      return
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      createdAt: user.createdAt,
    })
  } catch (error) {
    next(error)
  }
}