import { useEffect, useState } from "react";
import { productService } from "../../services/productService";
import { useParams, useNavigate } from "react-router-dom";
import { categoryService } from "../../services/categoryService";
import type { Category } from "../../types";

export default function EditProduct() {
    const { id } = useParams()!;
    const navigate = useNavigate()

    // Estados de formulario
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Cargar categorías
        categoryService.getAll().then(setCategories).catch(console.error);
    }, []);

    useEffect(() => {
        if (id) {
            // Como el backend no tiene ruta GET por ID, usamos getAll y lo buscamos
            productService.getAll()
                .then(products => {
                    const product = products.find(p => p.id === id);
                    if (product) {
                        setName(product.name);
                        setPrice(product.basePrice.toFixed(2));
                        setImage(product.images?.[0] || "");
                        setCategoryId(product.categoryId);
                    } else {
                        alert("Producto no encontrado");
                    }
                })
                .catch(err => alert("Error al cargar producto: " + err.message));
        }
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return; // Validación de TS: asegura que id es un string y no undefined
        
        setLoading(true);

        try {
            await productService.update(id, {
                name,
                basePrice: parseFloat(price) || 0,
                images: image ? [image] : [], 
                categoryId: categoryId
            });

            alert("Producto actualizado exitosamente");
            navigate("/admin/products"); // Redirigir a la lista de productos
        } catch (error: any) {
            alert("Error al actualizar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="section-title">Editar Producto</h1>
            </div>

            <form onSubmit={handleUpdate} style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nombre del Producto</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #444', borderRadius: '8px', color: '#fff' }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Precio</label>
                    <input 
                        type="number" 
                        step="0.01" 
                        value={price} 
                        onChange={e => setPrice(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #444', borderRadius: '8px', color: '#fff' }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>URL de Imagen</label>
                    <input 
                        type="text" 
                        value={image} 
                        onChange={e => setImage(e.target.value)} 
                        style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #444', borderRadius: '8px', color: '#fff' }}
                        placeholder="Ej: https://example.com/img.jpg"
                    />
                    {image && <img src={image} alt="Preview" style={{ marginTop: '0.5rem', maxWidth: '150px', borderRadius: '8px' }} />}
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Categoría</label>
                    <select 
                        value={categoryId} 
                        onChange={e => setCategoryId(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #444', borderRadius: '8px', color: '#fff' }}
                    >
                        <option value="">Selecciona una categoría</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="banner-btn" disabled={loading} style={{ width: '100%' }}>
                    {loading ? 'Actualizando...' : 'Actualizar Producto'}
                </button>
                <button type="button" onClick={() => navigate('/admin/products')} style={{ width: '100%', marginTop: '1rem', padding: '0.8rem', background: '#333', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
                    Cancelar
                </button>
            </form>
        </div>
    );
}