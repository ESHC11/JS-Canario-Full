import { useState, useEffect } from "react";
import { productService } from "../../services/productService";
import type { Product } from "../../types";

export default function ManageProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const prods = await productService.getAll();
            setProducts(prods);
        } catch (error) {
            console.error("Error al cargar datos", error);
            alert("Error al cargar productos");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        window.location.href = '/admin/products/new';
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
        try {
            await productService.delete(id);
            alert("Producto eliminado");
            loadData();
        } catch (error) {
            alert("Error al eliminar");
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Cargando...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="section-title">Gestionar Productos</h2>
                <button className="banner-btn" onClick={handleCreate} style={{ padding: '0.5rem 1rem' }}>
                    + Crear Producto
                </button>
            </div>

            <div className="admin-card" style={{ marginTop: '2rem', padding: 0, overflow: 'hidden' }}>
                <table className="admin-table">
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Categoría</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>
                                    {product.images && product.images[0] ? (
                                        <img src={product.images[0]} alt={product.name} style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: 40, height: 40, borderRadius: 4, background: '#333' }} />
                                    )}
                                </td>
                                <td>{product.name}</td>
                                <td>${product.basePrice.toFixed(2)}</td>
                                <td>{product.category?.name || product.categoryId}</td>
                                <td>
                                    <button 
                                        style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.2)', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}