import { useState, useEffect } from "react";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import api from "../../services/api";
import type { Category } from "../../types";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Loader2 } from "lucide-react";

export default function ProductForm() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    
    // Image Upload State
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await categoryService.getAll();
            setCategories(data);
            if (data.length > 0) setCategoryId(data[0].id);
        } catch (error) {
            console.error("Error al cargar categorías", error);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview local
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);

        // Upload a Cloudinary
        const formData = new FormData();
        formData.append("image", file);

        setIsUploading(true);
        try {
            const { data } = await api.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setImageUrl(data.url);
        } catch (error) {
            console.error("Error subiendo imagen:", error);
            alert("Error al subir la imagen");
            setImagePreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageUrl) {
            alert("Por favor, espera a que la imagen termine de subirse o selecciona una imagen.");
            return;
        }

        setIsSubmitting(true);
        try {
            await productService.create({
                name,
                description,
                basePrice: parseFloat(price) || 0,
                images: [imageUrl],
                categoryId: categoryId
            });
            alert("Producto creado exitosamente");
            navigate("/admin/products");
        } catch (error) {
            console.error(error);
            alert("Error al crear producto");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '2rem', fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 500 }}>
                Nuevo Producto
            </h2>
            
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Image Upload Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Imagen del Producto</label>
                    <div style={{ 
                        border: '2px dashed rgba(255,255,255,0.1)', 
                        borderRadius: '8px', 
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        background: 'rgba(0,0,0,0.2)',
                        minHeight: '200px'
                    }}>
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '4px' }} />
                        ) : (
                            <>
                                <UploadCloud size={40} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    Haz clic o arrastra una imagen aquí
                                </span>
                            </>
                        )}
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                        />
                        {isUploading && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                                <Loader2 size={30} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Nombre</label>
                    <input 
                        type="text" value={name} onChange={(e) => setName(e.target.value)} required
                        style={{ padding: '0.8rem', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Descripción</label>
                    <textarea 
                        value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                        style={{ padding: '0.8rem', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '4px', resize: 'vertical' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Precio Base ($)</label>
                        <input 
                            type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required
                            style={{ padding: '0.8rem', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '4px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Categoría</label>
                        <select 
                            value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required
                            style={{ padding: '0.8rem', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '4px', appearance: 'none' }}
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isUploading || isSubmitting}
                    className="banner-btn" 
                    style={{ padding: '1rem', cursor: isUploading ? 'not-allowed' : 'pointer', marginTop: '1rem', opacity: isUploading || isSubmitting ? 0.5 : 1 }}
                >
                    {isSubmitting ? 'Creando Producto...' : 'Guardar Producto'}
                </button>
            </form>
            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}