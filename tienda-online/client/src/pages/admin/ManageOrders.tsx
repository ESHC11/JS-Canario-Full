import { useState, useEffect } from "react";
import { orderService } from "../../services/orderService";
import type { Order, OrderStatus } from "../../types";

const STATUS_OPTIONS: OrderStatus[] = [
    'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'
];

export default function ManageOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await orderService.getAll(); // Trae TODAS las órdenes (requiere ser admin)
            setOrders(data);
        } catch (error) {
            console.error("Error al cargar órdenes:", error);
            alert("Error al cargar las órdenes. ¿Eres administrador?");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await orderService.updateStatus(orderId, newStatus);
            // Actualizar localmente para no tener que recargar todo
            setOrders(orders.map(order => 
                order.id === orderId ? { ...order, status: newStatus as OrderStatus } : order
            ));
            alert("Estado actualizado correctamente");
        } catch (error) {
            console.error("Error al actualizar estado:", error);
            alert("Hubo un error al actualizar el estado");
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Cargando órdenes...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h2 className="section-title">Gestión de Pedidos</h2>
            
            <table style={{ width: '100%', marginTop: '2rem', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#222', textAlign: 'left' }}>
                        <th style={{ padding: '1rem' }}>ID Pedido</th>
                        <th style={{ padding: '1rem' }}>Total</th>
                        <th style={{ padding: '1rem' }}>Fecha</th>
                        <th style={{ padding: '1rem' }}>Estado Actual</th>
                        <th style={{ padding: '1rem' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} style={{ borderBottom: '1px solid #333' }}>
                            <td style={{ padding: '1rem' }}>{order.id.slice(-6)}</td>
                            <td style={{ padding: '1rem' }}>${order.total.toFixed(2)}</td>
                            <td style={{ padding: '1rem' }}>
                                {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '1rem' }}>
                                <select 
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    style={{ padding: '0.5rem', background: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}
                                >
                                    {STATUS_OPTIONS.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </td>
                            <td style={{ padding: '1rem' }}>
                                <button className="banner-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                                    Ver detalles
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {orders.length === 0 && <p style={{ marginTop: '1rem' }}>No hay pedidos registrados.</p>}
        </div>
    )
}
