import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();

  const finalTotal = totalPrice

  if (items.length === 0) {
    return (
      <main>
        <section className="container cart-empty">
          <div className="cart-empty-icon">
            <ShoppingBag size={40} strokeWidth={1.5} style={{ color: '#fff' }} />
          </div>
          <h2>Tu carrito está vacío</h2>
          <p>Explora nuestras colecciones y encuentra algo que te encante.</p>
          <Link to="/shop" className="banner-btn" style={{ padding: '0.8rem 2rem' }}>
            Ir a la tienda
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section className="container" style={{ padding: '2rem 0', marginBottom: '6rem' }}>
        <h2 className="section-title">Tu Carrito ({totalItems})</h2>

        <div className="cart-layout">
          {/* Lista de items */}
          <div className="cart-items-list">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="cart-item-details">
                  <h4 className="cart-item-title">{item.name}</h4>
                  {item.variantName && <span className="cart-item-variant">Talla/Variante: {item.variantName}</span>}
                  <p className="cart-item-price">${item.price.toFixed(2)} MXN</p>
                </div>
                
                <div className="cart-item-actions">
                  <div className="cart-quantity-selector">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                      <Minus size={14} />
                    </button>
                    <span style={{ fontSize: '0.9rem', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <button className="cart-delete-btn" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="cart-summary">
            <h3>Resumen del pedido</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
            <span>Envío</span>
            <span><span style={{ color: '#4caf50' }}>Gratis</span></span>
          </div>
            
            <div className="summary-row total">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)} MXN</span>
            </div>
            
            <button className="cart-checkout-btn" onClick={() => navigate('/checkout')}>
              Proceder al pago
            </button>

          </div>
        </div>
      </section>
    </main>
  )
}