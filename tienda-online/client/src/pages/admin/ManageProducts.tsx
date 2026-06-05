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

    const handleCreate = async () => {
        const name = prompt("Nombre del producto");
        if (!name) return;
        const basePrice = parseFloat(prompt("Precio base") || "0");
        const categoryId = prompt("ID de la categoría (revisa ManageCategories para ver los IDs)");
        if (!categoryId) return;

        try {
            await productService.create({
                name,
                basePrice,
                categoryId,
                images: ["https://via.placeholder.com/150"]
            });
            alert("Producto creado");
            loadData(); // Recargar la lista
        } catch (error) {
            alert("Error al crear");
        }
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

            <table style={{ width: '100%', marginTop: '2rem', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#222', textAlign: 'left' }}>
                        <th style={{ padding: '1rem' }}>Nombre</th>
                        <th style={{ padding: '1rem' }}>Precio</th>
                        <th style={{ padding: '1rem' }}>Categoría</th>
                        <th style={{ padding: '1rem' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id} style={{ borderBottom: '1px solid #333' }}>
                            <td style={{ padding: '1rem' }}>{product.name}</td>
                            <td style={{ padding: '1rem' }}>${product.basePrice.toFixed(2)}</td>
                            <td style={{ padding: '1rem' }}>{product.category?.name || product.categoryId}</td>
                            <td style={{ padding: '1rem' }}>
                                <button 
                                    style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
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
    );
}