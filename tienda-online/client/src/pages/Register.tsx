import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error en el registro');
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
      {/* LADO IZQUIERDO: TEXTO HERO */}
      <div className="auth-text-side">
        <h1 className="frase-hero" style={{ marginLeft: '2vw' }}>
          Actitud que se lleva <span className="palabra-destacada">puesta.</span>
        </h1>
      </div>

      {/* LADO DERECHO: FORMULARIO */}
      <div className="auth-form-side">
        <div className="auth-form">
          <h2>Regístrate</h2>
          
          {error && <div style={{ color: '#ff4444', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label>Nombre Completo</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>

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
              Registrarse
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
            ¿Ya tienes cuenta? <Link to="/login">Iniciar Sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
