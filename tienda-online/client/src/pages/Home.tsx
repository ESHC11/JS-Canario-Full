import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';

const CATEGORIES = [
  { 
    id: 1, 
    name: 'Camisetas', 
    icon: (
      <svg width="44" height="44" viewBox="0 0 256 256"><path d="M192,120h28.34a8.44,8.44,0,0,0,7.5-4.42l19.27-36.81a7.81,7.81,0,0,0-3.33-10.52L192,40" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/><path d="M64,120H35.66a8.44,8.44,0,0,1-7.5-4.42L8.89,78.77a7.81,7.81,0,0,1,3.33-10.52L64,40" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/><path d="M160,40a32,32,0,0,1-64,0H64V208a8,8,0,0,0,8,8H184a8,8,0,0,0,8-8V40Z" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/></svg>
    ) 
  },
  { 
    id: 2, 
    name: 'Hoodies', 
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24">
        <g fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="1.125">
          <path strokeLinejoin="round" d="M17.64 12c-.1.745-.06 1.5.019 3.011L18 19.522c0 .707-.12 1.085-.755 1.426c-2.613 1.403-7.877 1.403-10.49 0c-.635-.341-.755-.72-.755-1.426l.341-4.51c.08-1.511.119-2.267.018-3.012"/>
          <path d="M14 17c0 .875.419 1.419 1 2m-5-2c0 .875-.419 1.419-1 2"/>
          <path strokeLinejoin="round" d="m7.4 6.897l3.882 1.85c.354.169.531.253.718.253s.364-.084.718-.253l3.882-1.85c.86-.409 1.29-.614 1.382-1.138c.093-.525-.18-.833-.724-1.45c-2.722-3.079-7.794-3.079-10.516 0c-.545.617-.817.925-.724 1.45s.523.729 1.382 1.138"/>
          <path strokeLinejoin="round" d="m14 6l-2 3l-2-3m-3.616.5c-1.35.267-2.557 1.52-3.395 2.642c-.537.718-.805 1.078-.938 1.741c-.133.664.007 1.218.287 2.325l1.3 5.13c.23.908 1.362.773 2.362-.236M17.616 6.5c1.35.267 2.557 1.52 3.395 2.642c.537.718.805 1.078.938 1.741c.133.664-.007 1.218-.287 2.325l-1.3 5.13c-.23.908-1.362.765-2.362.268"/>
        </g>
      </svg>
    ) 
  },
  { 
    id: 3, 
    name: 'Pantalones', 
    icon: (
      <svg width="44" height="44" viewBox="0 0 256 256"><path d="M186,32a8,8,0,0,1,7.94,7l22,176a8,8,0,0,1-7.94,9H167.31a8,8,0,0,1-7.76-6.06L128,96,96.45,217.94A8,8,0,0,1,88.69,224H48a8,8,0,0,1-7.94-9l22-176A8,8,0,0,1,70,32Z" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/><line x1="128" y1="96" x2="128" y2="64" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/><line x1="58.94" y1="64" x2="197.06" y2="64" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/><path d="M96,64a40,40,0,0,1-40,40c-.69,0-1.37,0-2,0" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/><path d="M202.06,104c-.68,0-1.37,0-2.06,0a40,40,0,0,1-40-40" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/></svg>
    ) 
  },
  { 
    id: 4, 
    name: 'Blusas', 
    icon: (
      <svg width="44" height="44" viewBox="0 0 256 256"><line x1="160" y1="35.22" x2="160" y2="8" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/><line x1="96" y1="8" x2="96" y2="35.22" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/><path d="M200,224a8,8,0,0,0,7.35-11.15L160,112l22.86-35.88a8,8,0,0,0,0-8.24L160,35.22,153,44a32,32,0,0,1-50,0l-7-8.77L73.14,67.88a8,8,0,0,0,0,8.24L96,112,48.66,212.85A8,8,0,0,0,56,224Z" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/><line x1="96" y1="112" x2="160" y2="112" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/></svg>
    ) 
  },
  { 
    id: 5, 
    name: 'Calzado', 
    icon: (
      <svg width="44" height="44" viewBox="0 0 256 256"><path d="M32,192a8,8,0,0,0,8,8H240a8,8,0,0,0,8-8V167.06a32,32,0,0,0-21.88-30.35l-60.73-20.25A32,32,0,0,1,146.27,99.1L123,44.75a8,8,0,0,0-10-4.27L37.27,68A8,8,0,0,0,32,75.54Z" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/><line x1="32" y1="168" x2="248" y2="168" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/><line x1="120" y1="104" x2="144.55" y2="95.07" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/><line x1="104" y1="80" x2="133.51" y2="69.27" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/><line x1="136" y1="128" x2="166.61" y2="116.87" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/></svg>
    ) 
  },
];

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data);
        }
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  return (
    <main>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h1 className="hero-title">No sigas tendencias,<br/>créalas</h1>
            <p className="hero-subtitle">Descubre las ultimas tendencias en ropa para cada ocasión.</p>
          </div>
          <div className="hero-logo" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img 
              src="/android-chrome-512x512.png" 
              alt="JS Canario" 
              style={{ width: '220px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }} 
            />
          </div>
        </div>
      </section>

      {/* ── CATEGORÍAS ── */}
      <section className="container">
        <div className="section-header">
          <h2 className="section-title">Comprar por categoría</h2>
          <Link to="/shop" className="see-all">Ver todas</Link>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map(cat => (
            <Link 
              key={cat.id} 
              to={`/shop?category=${cat.name}`} 
              className="category-card" 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="category-icon">{cat.icon}</div>
              <span className="category-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── LO MÁS VENDIDO ── */}
      <section className="container">
        <div className="section-header">
          <h2 className="section-title">Lo más vendido</h2>
        </div>
        <div className="products-grid">
          {products.slice(0, 5).map(item => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>



      {/* ── PRODUCTOS NUEVOS ── */}
      <section className="container">
        <div className="section-header">
          <h2 className="section-title">Productos Nuevos</h2>
        </div>
        <div className="products-grid">
          {products.slice().reverse().slice(0, 5).map(item => (
            <ProductCard key={'new'+item.id} product={item} />
          ))}
        </div>
      </section>
    </main>
  );
}

