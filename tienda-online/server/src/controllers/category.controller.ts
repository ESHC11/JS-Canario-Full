import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";

export async function getAllCategories(req:Request, res:Response, next:NextFunction) {
    try {
        const categories = await prisma.category.findMany() 
        res.status(200).json({success: true, data: categories})
    } catch (err) {
        next(err)
    }
}

// ***** Crear Categoria *******
export async function createCategory(req:Request, res:Response, next:NextFunction) {
    try {
        const {name} = req.body

        if (!name) {
            res.status(400).json({message: 'Nombre de categoría requerido'})
            return   
        }

        const slug = name.toLowerCase().replace(/\s+/g, '-')
        const category = await prisma.category.create({data: {name, slug}})
        res.status(201).json({message: 'Categoría creada correctamente'})
    } catch (err) {
        next(err)
    }
}

// ***** Actualizar Categoria *****
export async function updateCategory(req:Request, res:Response, next:NextFunction) {
    try {
        const id = req.params.id as string
        const {name} = req.body

        if (!name) {
            res.status(400).json({message: 'Nombre de categoría requerido'})
            return   
        }

        const slug = name.toLowerCase().replace(/\s+/g, '-')
        const updatedCategory = await prisma.category.update({
            where: { id },
            data: {name, slug}
        })
        res.status(200).json({message: 'Categoría actualizada correctamente', data: updatedCategory})
    } catch (err) {
        next(err)
    }
}

// ***** Eliminar Categoria *****
export async function deleteCategory(req:Request, res:Response, next:NextFunction) {
    try {
        const id = req.params.id as string
        const deletedCategory = await prisma.category.delete({
            where: { id }
        })
        res.status(200).json({message: 'Categoría eliminada correctamente', data: deletedCategory})
    } catch (err) {
        next(err)
    }
}