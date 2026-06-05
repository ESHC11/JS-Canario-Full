import { useState, useEffect } from "react";
import { orderService } from "../services/orderService";
import type { Order } from "../types";
import { Package } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pendiente', color: '#f39c12' },
  PAID: { label: 'Pagado', color: '#3498db' },
  PROCESSING: { label: 'Procesando', color: '#9b59b6' },
  SHIPPED: { label: 'Enviado', color: '#1abc9c' },
  DELIVERED: { label: 'Entregado', color: '#2ecc71' },
  CANCELLED: { label: 'Cancelado', color: '#e74c3c' },
  REFUNDED: { label: 'Reembolsado', color: '#95a5a6' },
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const data = await orderService.getUserOrders()
      setOrders(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar pedidos')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Cargando pedidos...</div>
  if (error) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: '#e74c3c' }}>{error}</div>

  if (orders.length === 0) {
    return (
      <main>
        <section className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <Package size={64} strokeWidth={1} style={{ color: '#555', marginBottom: '1rem' }} />
          <h2>No tienes pedidos aún</h2>
          <p style={{ color: '#888', marginTop: '0.5rem' }}>Cuando realices un pedido, aparecerá aquí.</p>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section className="container" style={{ padding: '2rem 0' }}>
        <h2 className="section-title">Mis Pedidos</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
          {orders.map((order) => {
            const statusInfo = STATUS_LABELS[order.status] || { label: order.status, color: '#888' }
            return (
              <div key={order.id} style={{
                background: '#0a0a0a', borderRadius: '16px', border: '1px solid #222', overflow: 'hidden'
              }}>
                {/* Header de la Orden */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: '#111', borderBottom: '1px solid #222' }}>
                  <div>
                    <span style={{ color: '#888', fontSize: '0.85rem', display: 'block', marginBottom: '0.2rem' }}>
                      Pedido del {new Date(order.createdAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span style={{ color: '#555', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                      ID: {order.id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      background: statusInfo.color + '22',
                      color: statusInfo.color,
                      padding: '0.4rem 1rem',
                      borderRadius: '30px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      display: 'inline-block',
                      marginBottom: '0.4rem'
                    }}>
                      {statusInfo.label}
                    </span>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>${order.total.toFixed(2)} MXN</div>
                  </div>
                </div>

                {/* Lista de Productos */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {order.items?.map((item: any) => (
                    <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img 
                        src={item.variant?.product?.images?.[0] || 'https://via.placeholder.com/60'} 
                        alt="Producto" 
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} 
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 500, fontSize: '0.95rem' }}>
                          {item.variant?.product?.name || 'Producto Desconocido'}
                        </p>
                        <p style={{ margin: '0.2rem 0 0', color: '#888', fontSize: '0.85rem' }}>
                          Talla: {item.variant?.size} x {item.quantity}
                        </p>
                      </div>
                      <div style={{ fontWeight: 500, color: '#aaa' }}>
                        ${item.unitPrice.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}
