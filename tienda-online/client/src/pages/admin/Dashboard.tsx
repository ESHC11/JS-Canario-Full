import { Link } from "react-router-dom";
export default function Dashboard() {
    return (
        <div style={{ padding: "2rem" }}>
            <h2 className="section-title">Administración</h2>
            <nav style={{ marginTop: "1rem" }}>
                <ul>
                    <li>
                        <Link to="/admin/products">Productos</Link>
                    </li>
                    <li>
                        <Link to="/admin/categories">Categorías</Link>
                    </li>
                    <li>
                        <Link to="/admin/users">Usuarios</Link>
                    </li>
                    <li>
                        <Link to="/admin/orders">Pedidos</Link>
                    </li>
                    <li>
                        <Link to="/admin/settings">Ajustes</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}