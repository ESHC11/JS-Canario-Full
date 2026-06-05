import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import type { Product } from "../types";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext"; 

export default function Wishlist() {
    const navigate = useNavigate();
    const { user, isLoading } = useAuth();
    const { addToCart } = useCart(); 
    const [wishlist, setWishlist] = useState<Product[]>([]);

    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/login");
            return;
        }

        // Cargar lista de deseos desde localStorage
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWishlist(savedWishlist);
    }, [isLoading, user, navigate]);

    const removeFromWishlist = (productId: string) => {
        const newWishlist = wishlist.filter(item => item.id !== productId);
        setWishlist(newWishlist);
        localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    };

    const handleAddToCart = (product: Product) => {
        addToCart(product, null, 1); 
        alert("Agregado al carrito");
        removeFromWishlist(product.id);
    };

    return (
        <main>
            <section className="container" style={{ padding: '2rem 0' }}>
                <h2 className="section-title">Mi Lista de Deseos</h2>

                {wishlist.length > 0 ? (
                    <div className="products-grid" style={{ marginTop: '2rem' }}>
                        {wishlist.map((item) => (
                            <div key={item.id} className="product-card">
                                <div className="product-image">
                                    <img src={item.images?.[0]} alt={item.name} />
                                </div>
                                <div className="product-info">
                                    <h3 className="product-title">{item.name}</h3>
                                    <p className="product-price">${item.basePrice.toFixed(2)} MXN</p>
                                    
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                        <button 
                                            className="banner-btn" 
                                            style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                            onClick={() => handleAddToCart(item)}
                                        >
                                            <ShoppingCart size={16} /> Agregar
                                        </button>
                                        <button 
                                            style={{ background: '#333', border: 'none', borderRadius: '8px', padding: '0 1rem', color: '#e74c3c', cursor: 'pointer' }}
                                            onClick={() => removeFromWishlist(item.id)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                        <Heart size={64} strokeWidth={1} style={{ color: '#555', marginBottom: '1rem' }} />
                        <h3>Tu lista de deseos está vacía</h3>
                        <p style={{ color: '#888', margin: '1rem 0' }}>Encuentra algo que te guste y guárdalo para después.</p>
                        <Link to="/shop" className="banner-btn" style={{ display: 'inline-block', marginTop: '1rem' }}>
                            Explorar tienda
                        </Link>
                    </div>
                )}
            </section>
        </main>
    )
}