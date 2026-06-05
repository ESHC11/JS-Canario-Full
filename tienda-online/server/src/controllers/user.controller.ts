import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";

// Obtener todos los usuarios (Admin)
export async function getAllUsers(req:Request, res:Response, next:NextFunction) {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, createdAt: true }
        })
        res.status(200).json({success: true, data: users})
    } catch (error) {
        next(error)
    }
}

// Actualizar perfil/dirección del usuario
export async function updateUser(req:Request, res:Response, next:NextFunction) {
    try {
        const { name, address } = req.body;
        
        // Protegemos: Solo actualiza nombre y dirección. 
        // req.user viene del middleware de autenticación.
        const updatedUser = await prisma.user.update({
            where: { id: req.user!.id },
            data: { 
                name,
                address: address ? {
                    upsert: {
                        create: address,
                        update: address
                    }
                } : undefined
            },
            include: { address: true }
        })
        res.status(200).json({message: 'Perfil actualizado', data: updatedUser})
    } catch (error) {
        next(error)
    }
}

// Eliminar usuario (Admin)
export async function deleteUser(req:Request, res:Response, next:NextFunction) {
    try {
        const id = req.params.id as string
        const deletedUser = await prisma.user.delete({
            where: { id }
        })
        res.status(200).json({message: 'Usuario eliminado correctamente', data: deletedUser})
    } catch (error) {
        next(error)
    }
}