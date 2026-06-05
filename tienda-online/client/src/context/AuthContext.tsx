import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authService } from "../services/authService";
import type { User } from "../types";

// 1. Definimos qué cosas va a tener nuestra "Caja Global" de Auth
interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

// 2. Creamos el contexto vacío (la caja)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Creamos el Proveedor (el que va a envolver la app y repartir los datos)
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // Al cargar la app, revisamos si ya había un token guardado en localStorage
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const data = await authService.getMe(); // Pedimos los datos del usuario al backend
                    setUser(data.data);
                } catch (error) {
                    // Si el token falló (ej. expiró), lo borramos
                    console.error("Token inválido o expirado");
                    localStorage.removeItem("token");
                    setUser(null);
                }
            }
            setIsLoading(false); // Terminamos de cargar
        };
        
        checkAuth();
    }, []);
    const login = async (email: string, password: string) => {
        const response = await authService.login(email, password);
        localStorage.setItem("token", response.token); // Guardamos el token en el navegador
        setUser(response.user); // Guardamos el usuario en el estado global
    };
    const register = async (name: string, email: string, password: string) => {
        const response = await authService.register(name, email, password);
        localStorage.setItem("token", response.token);
        setUser(response.user);
    };
    const logout = () => {
        localStorage.removeItem("token"); // Borramos el token
        setUser(null); // Borramos el estado
    };

    // 4. Retornamos el Proveedor con todos los valores que queremos compartir
    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
// 5. Creamos un Hook personalizado para que usar el contexto sea súper fácil en otras páginas
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
}

