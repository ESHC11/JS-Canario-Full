import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { orderService } from "../services/orderService";
import { paymentService } from "../services/paymentService";
import { UserCircle } from "lucide-react";

export default function Checkout() {
  const { items, totalPrice, totalItems } = useCart();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Si no hay items (pero aseguramos de no redirigir mientras auth carga si no queremos)
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  // Formulario de dirección local
  const [address, setAddress] = useState({
    municipality: '',
    neighborhood: '',
    street: '',
    phone: '',
    references: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const orderItems = items.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.price
      }));

      const order = await orderService.create(orderItems, address)
      const { url } = await paymentService.createCheckoutSession(order.id)
      window.location.href = url
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar el pedido. Por favor verifica que hayas iniciado sesión.')
      setLoading(false)
    }
  }

  const finalTotal = totalPrice

  if (authLoading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Verificando sesión...</div>;

  if (!user) {
    return (
      <main>
        <section className="container cart-empty">
          <div className="cart-empty-icon">
            <UserCircle size={40} strokeWidth={1.5} style={{ color: '#fff' }} />
          </div>
          <h2>Inicia sesión para continuar</h2>
          <p>Para poder procesar tu pedido, necesitamos que inicies sesión o crees una cuenta.</p>
          <Link to="/profile" className="banner-btn" style={{ padding: '0.8rem 2rem', marginTop: '1rem' }}>
            Ir a Iniciar Sesión
          </Link>
        </section>
      </main>
    );
  }

  if (items.length === 0) return null;

  return (
    <main>
      <section className="container" style={{ padding: '2rem 0', marginBottom: '6rem' }}>
        <h2 className="section-title">Finalizar Pedido</h2>

        {error && (
          <div style={{ background: '#2d1a1a', color: '#e74c3c', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #4a2a2a' }}>
            {error}
          </div>
        )}

        <div className="cart-layout">
          {/* Formulario de Dirección Local */}
          <div style={{ background: '#0a0a0a', padding: '2rem', borderRadius: '16px', border: '1px solid #222' }}>
            <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.4rem', fontWeight: 500 }}>Datos de Entrega Local</h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div>
                <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Municipio / Pueblo</label>
                <select
                  name="municipality" value={address.municipality} onChange={handleChange} required
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '1rem', appearance: 'none' }}
                >
                  <option value="">Selecciona tu municipio...</option>
                  <option value="Pueblo Principal">Pueblo Principal (Local)</option>
                  <option value="Pueblo Vecino 1">Pueblo Vecino 1</option>
                  <option value="Pueblo Vecino 2">Pueblo Vecino 2</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Colonia / Barrio</label>
                  <input
                    name="neighborhood" value={address.neighborhood} onChange={handleChange} required
                    placeholder="Ej. Centro"
                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '1rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Teléfono (WhatsApp)</label>
                  <input
                    name="phone" type="tel" value={address.phone} onChange={handleChange} required
                    placeholder="Para contactarte en la entrega"
                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '1rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Calle y número exterior / interior</label>
                <input
                  name="street" value={address.street} onChange={handleChange} required
                  placeholder="Ej. Calle Hidalgo #123"
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '1rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Referencias del domicilio</label>
                <textarea
                  name="references" value={address.references} onChange={handleChange}
                  placeholder="Ej. Casa verde de dos pisos frente al parque, portón negro..."
                  rows={3}
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '1rem', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                className="banner-btn"
                disabled={loading || !address.municipality}
                style={{ width: '100%', marginTop: '1rem', padding: '1.2rem', fontSize: '1.1rem', borderRadius: '30px' }}
              >
                {loading ? 'Redirigiendo al pago...' : 'Ir a pagar'}
              </button>
            </form>
          </div>

          {/* Resumen del Pedido */}
          <div className="cart-summary" style={{ height: 'fit-content' }}>
            <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.4rem', fontWeight: 500 }}>Resumen del Pedido</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: '0.95rem' }}>{item.name}</p>
                    {item.variantName && (
                      <p style={{ margin: '0.2rem 0 0', color: '#888', fontSize: '0.85rem' }}>{item.variantName} x {item.quantity}</p>
                    )}
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span>Subtotal ({totalItems} artículos)</span>
              <span>${totalPrice.toFixed(2)} MXN</span>
            </div>
            
            <div className="summary-row">
              <span>Costo de envío</span>
              <span><span style={{ color: '#4caf50' }}>Gratis</span></span>
            </div>
            
            <div className="summary-row total" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #333' }}>
              <span>Total a pagar</span>
              <span style={{ fontSize: '1.6rem' }}>${finalTotal.toFixed(2)} MXN</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}