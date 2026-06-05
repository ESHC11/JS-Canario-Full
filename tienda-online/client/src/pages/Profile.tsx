import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
    const navigate = useNavigate();
    const { user, isLoading, logout } = useAuth();

    // El error naranja se solucionaba usando useEffect aquí, para que 
    // la redirección ocurra después de que la pantalla se intente dibujar
    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/login");
        }
    }, [user, isLoading, navigate]);

    if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Cargando perfil...</div>;
    if (!user) return null; // No dibujamos nada mientras redirecciona
    
    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Perfil de Usuario</h2>
            <div style={{ background: '#111', padding: '2rem', borderRadius: '12px' }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}><strong>Nombre:</strong> {user.name}</p>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}><strong>Email:</strong> {user.email}</p>
                
                <button 
                    onClick={() => {
                        logout();
                        navigate("/");
                    }}
                    style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Cerrar Sesión
                </button>
            </div>
        </div>
    )
}