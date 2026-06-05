import React, { useState } from 'react';
import { Menu, Search, Heart, ShoppingCart, User, X, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
      <nav className="navbar container">
        <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <button className="menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} strokeWidth={1.5} />
          </button>
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/android-chrome-512x512.png" 
              alt="JS Canario" 
              style={{ height: '36px', borderRadius: '6px' }} 
            />
          </Link>
        </div>
        
        <div className="nav-center">
          <form 
            className="search-bar" 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const search = formData.get('search');
              if (search) {
                navigate(`/shop?search=${encodeURIComponent(search.toString())}`);
              }
            }}
          >
            <input type="text" name="search" placeholder="Buscar productos..." />
            <button type="submit" style={{ background: 'none', border: 'none', display: 'flex' }}>
              <Search size={16} strokeWidth={2} className="search-icon" />
            </button>
          </form>
        </div>
        
        <div className="nav-right">
          {user?.role === 'ADMIN' && (
            <button className="icon-btn" onClick={() => navigate('/admin')} title="Panel de Control">
              <LayoutDashboard size={22} strokeWidth={1.5} style={{ color: '#f39c12' }} />
            </button>
          )}
          <button className="icon-btn" onClick={() => navigate('/wishlist')}>
            <Heart size={24} strokeWidth={2} />
          </button>
          <button className="icon-btn" onClick={() => navigate('/cart')}>
            <ShoppingCart size={22} strokeWidth={1.5} />
          </button>
          <button className="icon-btn" onClick={() => navigate('/profile')}>
            <User size={22} strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* Menú Móvil - Fondo oscuro (Overlay) */}
      <div 
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Menú Móvil - Panel Lateral (Drawer) */}
      <div className={`mobile-menu-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>Menú</span>
          <button className="close-menu-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>
        
        <div className="mobile-menu-links">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Inicio</Link>
          <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Tienda</Link>
          <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>Carrito de Compras</Link>
          <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Mi Perfil</Link>
          
          {user?.role === 'ADMIN' && (
            <>
              <hr style={{ borderColor: '#222', margin: '1rem 0' }} />
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#f39c12' }}>Panel de Administrador</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
