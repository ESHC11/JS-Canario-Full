import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determinamos si es Login o Registro por la URL inicial
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');

  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  // --- Estados de Formulario de Login ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // --- Estados de Formulario de Registro ---
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [error, setError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email: loginEmail, password: loginPassword });
      const data = res.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate(data.user.role === 'ADMIN' ? '/admin' : '/');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error en el inicio de sesión');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', { name: regName, email: regEmail, password: regPassword });
      const data = res.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate(data.user.role === 'ADMIN' ? '/admin' : '/');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error en el registro');
    }
  };

  const toggleAuth = () => {
    setError('');
    if (isLogin) {
      navigate('/register');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="auth-slider-container">
      
      {/* Botón de regreso */}
      <button 
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          zIndex: 100,
          background: 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '1rem',
          fontFamily: 'var(--font-sans)'
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Volver a la tienda
      </button>

      {/* TEXTO IZQUIERDO (Se ve cuando la caja negra está a la derecha en Registro) */}
      <div className="auth-text-bg left-text">
        <h1 className="frase-hero">
          Actitud que se lleva <span className="palabra-destacada">puesta.</span>
        </h1>
      </div>

      {/* TEXTO DERECHO (Se ve cuando la caja negra está a la izquierda en Login) */}
      <div className="auth-text-bg right-text">
        <h1 className="frase-hero">
          Donde el estilo se vuelve <span className="palabra-destacada">identidad.</span>
        </h1>
      </div>

      {/* CAJA NEGRA DESLIZANTE */}
      <div className={`auth-sliding-box ${!isLogin ? 'slide-right' : ''}`}>
        
        {error && <div className="auth-error-toast">{error}</div>}

        {/* --- CONTENEDOR LOGIN --- */}
        <div className={`auth-form-wrapper ${isLogin ? 'show' : 'hide'}`}>
          <div className="auth-form">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="auth-input-group">
                <label>Correo Electrónico</label>
                <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
              </div>
              <div className="auth-input-group">
                <label>Contraseña</label>
                <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
              </div>
              <button type="submit" className="auth-submit-btn">Ingresar</button>
            </form>
            
            <div className="auth-divider">O continúe con</div>
            <button className="auth-google-btn" type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8m-4-4h8" />
              </svg>
              Google
            </button>

            <p className="auth-link-text">
              ¿Aún no tienes cuenta? <span className="auth-switch-link" onClick={toggleAuth}>Regístrate</span>
            </p>
          </div>
        </div>

        {/* --- CONTENEDOR REGISTRO --- */}
        <div className={`auth-form-wrapper ${!isLogin ? 'show' : 'hide'}`}>
          <div className="auth-form">
            <h2>Regístrate</h2>
            <form onSubmit={handleRegisterSubmit}>
              <div className="auth-input-group">
                <label>Nombre Completo</label>
                <input type="text" value={regName} onChange={e => setRegName(e.target.value)} required />
              </div>
              <div className="auth-input-group">
                <label>Correo Electrónico</label>
                <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
              </div>
              <div className="auth-input-group">
                <label>Contraseña</label>
                <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required />
              </div>
              <button type="submit" className="auth-submit-btn">Registrarse</button>
            </form>

            <div className="auth-divider">O continúe con</div>
            <button className="auth-google-btn" type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8m-4-4h8" />
              </svg>
              Google
            </button>

            <p className="auth-link-text">
              ¿Ya tienes cuenta? <span className="auth-switch-link" onClick={toggleAuth}>Iniciar Sesión</span>
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
