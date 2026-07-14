import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, List, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/products', label: 'Productos', icon: <ShoppingBag size={20} /> },
    { path: '/admin/categories', label: 'Categorías', icon: <List size={20} /> },
    { path: '/admin/orders', label: 'Pedidos', icon: <ShoppingBag size={20} /> },
    { path: '/admin/users', label: 'Usuarios', icon: <Users size={20} /> },
    { path: '/admin/settings', label: 'Ajustes', icon: <Settings size={20} /> },
  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h1 className="admin-sidebar-logo">JS CANARIO</h1>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin') ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={logout} className="admin-nav-item" style={{ width: '100%' }}>
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Admin</span>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#333' }}></div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
