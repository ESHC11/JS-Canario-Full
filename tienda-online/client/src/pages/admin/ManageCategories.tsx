import { useState, useEffect } from "react";
import { categoryService } from "../../services/categoryService";
import type { Category } from "../../types";

export default function ManageCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (error) {
            console.error("Error al cargar", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        const name = prompt("Nombre de la nueva categoría");
        if (!name) return;

        try {
            await categoryService.create(name);
            alert("Categoría creada");
            loadCategories();
        } catch (error) {
            alert("Error al crear la categoría");
        }
    };

    const handleUpdate = async (id: string) => {
        const newName = prompt("Nuevo nombre para la categoría");
        if (!newName) return;

        try {
            await categoryService.update(id, newName);
            alert("Categoría actualizada");
            loadCategories();
        } catch (error) {
            alert("Error al actualizar");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro que deseas eliminar esta categoría?")) return;

        try {
            await categoryService.delete(id);
            alert("Categoría eliminada");
            loadCategories();
        } catch (error) {
            alert("Error al eliminar");
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Cargando...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="section-title">Gestionar Categorías</h2>
                <button className="banner-btn" onClick={handleCreate} style={{ padding: '0.5rem 1rem' }}>
                    + Crear Categoría
                </button>
            </div>

            <table style={{ width: '100%', marginTop: '2rem', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#222', textAlign: 'left' }}>
                        <th style={{ padding: '1rem' }}>ID (Para crear productos)</th>
                        <th style={{ padding: '1rem' }}>Nombre</th>
                        <th style={{ padding: '1rem' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => (
                        <tr key={category.id} style={{ borderBottom: '1px solid #333' }}>
                            <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{category.id}</td>
                            <td style={{ padding: '1rem' }}>{category.name}</td>
                            <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                <button 
                                    style={{ background: '#3498db', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                                    onClick={() => handleUpdate(category.id)}
                                >
                                    Editar
                                </button>
                                <button 
                                    style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                                    onClick={() => handleDelete(category.id)}
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