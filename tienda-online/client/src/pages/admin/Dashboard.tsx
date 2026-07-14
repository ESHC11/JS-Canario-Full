import { ShoppingBag, Users, DollarSign, Package } from "lucide-react";

export default function Dashboard() {
    const stats = [
        { label: "Ventas Totales", value: "$12,450", icon: <DollarSign size={24} />, color: "#4caf50" },
        { label: "Pedidos", value: "145", icon: <ShoppingBag size={24} />, color: "#2196f3" },
        { label: "Clientes", value: "89", icon: <Users size={24} />, color: "#9c27b0" },
        { label: "Productos Activos", value: "42", icon: <Package size={24} />, color: "#ff9800" }
    ];

    return (
        <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '2rem' }}>
                Resumen General
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {stats.map((stat, i) => (
                    <div key={i} className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ 
                            width: 60, height: 60, 
                            borderRadius: '12px', 
                            background: `${stat.color}20`, 
                            color: stat.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center' 
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{stat.label}</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 600 }}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="admin-card">
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '1.5rem' }}>Últimas Actividades</h3>
                <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem 0' }}>
                    Aún no hay suficiente información para mostrar estadísticas avanzadas.
                </div>
            </div>
        </div>
    )
}