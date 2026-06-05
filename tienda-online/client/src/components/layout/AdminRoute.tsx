import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ padding: '4rem', textAlign: 'center', color: '#fff' }}>Verificando permisos...</div>;
  }

  // Si no está logueado o no es ADMIN, lo mandamos a la página principal
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  // Si es ADMIN, le permitimos ver el contenido (Dashboard)
  return <Outlet />;
}
