import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";

// Obtener todos los productos
export async function getAllProducts(req:Request, res:Response, next:NextFunction) {
    try {
        const products = await prisma.product.findMany({
            include: { category: true, variants: true }
        })
        res.status(200).json({success:true, data:products})
    } catch (error) {
        next(error)
    }
}

// Obtener producto por slug
export async function getProductBySlug(req:Request, res:Response, next:NextFunction) {
    try {
        const slug = req.params.slug as string
        const product = await prisma.product.findUnique({
            where: { slug },
            include: { category: true, variants: true }
        })
        if (!product) {
            res.status(404).json({ message: 'Producto no encontrado' })
            return
        }
        res.status(200).json({success:true, data:product})
    } catch (error) {
        next(error)
    }
}

// Crear producto
export async function createProduct(req:Request, res:Response, next:NextFunction) {
    try {
        const { name, description, basePrice, categoryId, images } = req.body
        if (!name || basePrice === undefined || !categoryId) {
            res.status(400).json({message: "Faltan campos requeridos"})
            return
        }
        const slug = name.toLowerCase().replace(/\s+/g, '-')
        const newProduct = await prisma.product.create({ 
            data: { name, description, slug, basePrice, categoryId, images: images || [] }
        })
        res.status(201).json({message:"Producto creado", data: newProduct})
    } catch (error) {
        next(error)
    }
}

// Actualizar producto
export async function updateProduct(req:Request, res:Response, next:NextFunction) {
    try {
        const { name, description, basePrice, categoryId, images, isActive } = req.body
        const dataToUpdate: any = { description, basePrice, categoryId, images, isActive }
        if (name) {
            dataToUpdate.name = name
            dataToUpdate.slug = name.toLowerCase().replace(/\s+/g, '-')
        }

        const id = req.params.id as string
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: dataToUpdate
        })
        res.status(200).json({message:"Producto actualizado", data: updatedProduct})
    } catch (error) {
        next(error)
    }
}

// Eliminar producto
export async function deleteProduct(req:Request, res:Response, next:NextFunction) {
    try {
        const id = req.params.id as string
        const deletedProduct = await prisma.product.delete({
            where: { id }
        })
        res.status(200).json({message: 'Producto eliminado', data: deletedProduct})
    } catch (error) {
        next(error)
    }
}