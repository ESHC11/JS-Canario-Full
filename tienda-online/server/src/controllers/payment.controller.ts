import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";

// Simulación para crear sesión de pago (Stripe)
export async function createCheckoutSession(req:Request, res:Response, next:NextFunction) {
    try {
        const { orderId } = req.body;

        if (!orderId || typeof orderId !== 'string') {
            res.status(400).json({ message: "orderId es requerido" })
            return
        }

        const order = await prisma.order.findUnique({ where: { id: orderId }});
        if (!order) {
            res.status(404).json({ message: "Orden no encontrada" })
            return
        }

        // Mock: Simulación de URL de pago exitoso de Stripe
        const mockStripeUrl = `http://localhost:5173/checkout/success?order_id=${order.id}`;

        res.status(200).json({ url: mockStripeUrl });
    } catch (error) {
        next(error)
    }
}

export async function stripeWebhook(req:Request, res:Response, next:NextFunction) {
    // Mock: El webhook de stripe llamaría esto.
    res.status(200).send("Webhook received");
}
