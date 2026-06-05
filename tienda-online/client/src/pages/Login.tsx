import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error en el inicio de sesión');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-layout">
      {/* LADO IZQUIERDO: FORMULARIO */}
      <div className="auth-form-side">
        <div className="auth-form">
          <h2>Iniciar Sesión</h2>
          
          {error && <div style={{ color: '#ff4444', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label>Correo Electrónico</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            
            <div className="auth-input-group">
              <label>Contraseña</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <button type="submit" className="auth-submit-btn">
              Iniciar Sesión
            </button>
          </form>

          <div className="auth-divider">
            O continúe con
          </div>

          <button className="auth-google-btn" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8m-4-4h8" />
            </svg>
            Google
          </button>

          <p className="auth-link-text">
            ¿Aún no tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </div>
      </div>

      {/* LADO DERECHO: TEXTO HERO */}
      <div className="auth-text-side">
        <h1 className="frase-hero">
          Donde el estilo se vuelve <span className="palabra-destacada">identidad.</span>
        </h1>
      </div>
    </div>
  );
}
