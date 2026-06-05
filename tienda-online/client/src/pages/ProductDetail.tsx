import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Heart } from "lucide-react";
import { productService } from "../services/productService";
import type { Product, ProductVariant } from "../types";
import VariantSelector from "../components/products/VariantSelector";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productService.getBySlug(slug!)
      setProduct(data)
      if (data.variants && data.variants.length > 0) {
        setSelectedVariant(data.variants[0])
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar el producto")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, selectedVariant, 1);
    
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Aquí podrías conectarlo al WishlistContext o API
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Cargando producto...</div>
  if (error) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: '#e74c3c' }}>{error}</div>
  if (!product) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Producto no encontrado</div>

  const displayPrice = selectedVariant?.price ?? product.basePrice

  return (
    <main style={{ position: 'relative' }}>
      <section className="container" style={{ padding: '2rem 0', marginBottom: '4rem' }}>
        <Link to="/shop" className="see-all" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Volver a la tienda</Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginTop: '1rem', alignItems: 'start' }}>
          {/* Imagen del producto */}
          <div style={{ 
            borderRadius: '16px', 
            overflow: 'hidden', 
            background: 'var(--bg-product-img)',
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            position: 'relative'
          }}>
            <img src={product.images?.[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            
            {/* Botón de Wishlist */}
            <button 
              onClick={toggleWishlist}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#fff',
                color: isWishlisted ? '#ff4d4f' : '#000',
                border: 'none',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Heart size={22} fill={isWishlisted ? '#ff4d4f' : 'transparent'} strokeWidth={1.5} />
            </button>
          </div>

          {/* Info del producto */}
          <div style={{ padding: '2rem 0' }}>
            <span style={{ color: '#888', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {product.category?.name}
            </span>
            <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0', fontFamily: 'var(--font-serif)', fontWeight: 500 }}>
              {product.name}
            </h1>
            <p className="product-price" style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '1rem' }}>
              ${displayPrice.toFixed(2)} MXN
            </p>

            {product.description && (
              <p style={{ color: '#aaa', margin: '1.5rem 0', lineHeight: 1.6, fontSize: '1.05rem' }}>
                {product.description}
              </p>
            )}

            <div style={{ margin: '2rem 0' }}>
              <VariantSelector 
                variants={product.variants || []} 
                selectedVariant={selectedVariant} 
                onSelectVariant={setSelectedVariant} 
              />
            </div>

            {selectedVariant && (
              <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Stock: {selectedVariant.stock > 0 ? <span style={{color: '#4caf50'}}>{selectedVariant.stock} disponibles</span> : <span style={{color: '#ff4d4f'}}>Agotado</span>}
              </p>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                className="banner-btn"
                style={{ padding: '1rem 2rem', fontSize: '1rem', flex: 1, borderRadius: '30px' }}
                disabled={selectedVariant?.stock === 0}
                onClick={handleAddToCart}
              >
                Agregar al carrito
              </button>
              
              <button
                style={{ padding: '1rem 2rem', fontSize: '1rem', background: '#222', color: '#fff', border: '1px solid #333', borderRadius: '30px', cursor: 'pointer', transition: 'background 0.2s' }}
                onClick={() => navigate('/cart')}
                onMouseOver={(e) => e.currentTarget.style.background = '#333'}
                onMouseOut={(e) => e.currentTarget.style.background = '#222'}
              >
                Ir al carrito
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      <div style={{
        position: 'fixed',
        bottom: showToast ? '40px' : '-100px',
        right: '40px',
        background: '#fff',
        color: '#000',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transition: 'bottom 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s',
        opacity: showToast ? 1 : 0,
        zIndex: 1000,
        fontWeight: 500
      }}>
        <CheckCircle2 size={24} color="#000" />
        <div>
          <p style={{ margin: 0 }}>¡Agregado al carrito!</p>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>{product.name}</p>
        </div>
      </div>
    </main>
  )
}