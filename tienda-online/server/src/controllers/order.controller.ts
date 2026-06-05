import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";

// Obtener todas las ordenes (Admin)
export async function getAllOrders(req:Request, res:Response, next:NextFunction) {
    try {
        const orders = await prisma.order.findMany({ include: { items: true, user: { select: { name: true, email: true } } }})
        res.status(200).json({success: true, data:orders})
    } catch (error) {
        next(error)
    }
}

// Obtener las ordenes del usuario autenticado
export async function getUserOrders(req:Request, res:Response, next:NextFunction) {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user!.id },
            include: { items: { include: { variant: { include: { product: true } } } } },
            orderBy: { createdAt: 'desc' }
        })
        res.status(200).json({success: true, data: orders})
    } catch (error) {
        next(error)
    }
}

// Crear orden a partir del carrito
export async function createOrder(req:Request, res:Response, next:NextFunction) {
    try {
        const { items, shippingAddress } = req.body; 
        
        if (!items || items.length === 0) {
            res.status(400).json({message: "La orden no tiene items"})
            return
        }

        const subtotal = items.reduce((acc: number, item: any) => acc + (item.unitPrice * item.quantity), 0);
        const shippingCost = 0; // Envío siempre gratis
        const total = subtotal + shippingCost;

        const order = await prisma.order.create({
            data: {
                userId: req.user!.id,
                subtotal,
                shippingCost,
                total,
                shippingAddress: shippingAddress || {}, // Se espera JSON
                items: {
                    create: items.map((item: any) => ({
                        variantId: item.variantId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice
                    }))
                }
            },
            include: { items: true }
        })

        res.status(201).json({ message: "Orden creada", data: order })
    } catch (error) {
        next(error)
    }
}

// Actualizar estado de la orden (Admin)
export async function updateOrderStatus(req:Request, res:Response, next:NextFunction) {
    try {
        const id = req.params.id as string
        const { status } = req.body;
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status }
        })
        res.status(200).json({ message: "Estado actualizado", data: updatedOrder })
    } catch (error) {
        next(error)
    }
}
