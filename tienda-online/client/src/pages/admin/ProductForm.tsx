import { useState } from "react";
import { productService } from "../../services/productService";

export default function ProductForm () {
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [image, setImage] = useState("")
    const [categoryId, setCategoryId] = useState("")

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault() // Evita que la página se recargue

        try {
            await productService.create({
                name, 
                basePrice: parseFloat(price) || 0, // Prisma espera basePrice (número)
                images: image ? [image] : [],      // Prisma espera images (array)
                categoryId: categoryId             // Prisma espera categoryId
            })
            alert("Producto creado exitosamente")
            // Limpiar formulario
            setName("")
            setPrice("")
            setImage("")
            setCategoryId("")
        } catch(error) {
            console.error(error)
            alert("Error al crear producto")
        }
    }
    
    return (
        <div style={{ padding: '2rem' }}>
            <h1 className="section-title">Crear Producto</h1>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', marginTop: '2rem' }}>
                <input 
                    type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required
                    style={{ padding: '0.8rem', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '4px' }}
                />
                <input 
                    type="number" placeholder="Precio Base" value={price} onChange={(e) => setPrice(e.target.value)} required
                    style={{ padding: '0.8rem', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '4px' }}
                />
                <input 
                    type="text" placeholder="URL de la Imagen" value={image} onChange={(e) => setImage(e.target.value)} 
                    style={{ padding: '0.8rem', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '4px' }}
                />
                <input 
                    type="text" placeholder="ID de la Categoría" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required
                    style={{ padding: '0.8rem', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '4px' }}
                />
                <button type="submit" className="banner-btn" style={{ padding: '0.8rem', cursor: 'pointer' }}>
                    Crear Producto
                </button>
            </form>
        </div>
    )
}