import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order_id')

  return (
    <main>
      <section className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <CheckCircle size={72} strokeWidth={1.5} style={{ color: '#2ecc71', marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>¡Pedido realizado con éxito!</h1>
        <p style={{ color: '#888', marginBottom: '0.5rem' }}>
          Tu pedido ha sido procesado correctamente.
        </p>
        {orderId && (
          <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '2rem' }}>
            ID del pedido: <code style={{ color: '#fff' }}>{orderId}</code>
          </p>
        )}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/orders" className="banner-btn" style={{ display: 'inline-block' }}>
            Ver mis pedidos
          </Link>
          <Link to="/shop" className="see-all" style={{ display: 'inline-flex', alignItems: 'center' }}>
            Seguir comprando
          </Link>
        </div>
      </section>
    </main>
  )
}
