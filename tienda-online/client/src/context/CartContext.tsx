import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Product, ProductVariant } from "../types";

export interface CartItem {
    id: string; // ID único para el carrito (combinación de productId + variantId)
    productId: string;
    variantId?: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    variantName?: string; // Ej: "Rojo, Talla M"
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, variant: ProductVariant | null, quantity?: number) => void;
    removeFromCart: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    // Inicializar el carrito leyendo de localStorage si existe
    const [items, setItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    // Cada vez que 'items' cambie, guardamos el nuevo carrito en localStorage
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Product, variant: ProductVariant | null, quantity: number = 1) => {
        setItems(prevItems => {
            // Creamos un ID único que combine el producto y su variante elegida
            const cartItemId = variant ? `${product.id}-${variant.id}` : product.id;
            
            // Revisamos si este producto exacto ya está en el carrito
            const existingItem = prevItems.find(item => item.id === cartItemId);

            if (existingItem) {
                // Si ya está, solo sumamos la cantidad
                return prevItems.map(item => 
                    item.id === cartItemId 
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            // Si es nuevo, determinamos el precio e imagen final
            const price = variant?.price ?? product.basePrice;
            const image = variant?.sku /* o usar images del producto */ ? product.images?.[0] : product.images?.[0] || "";
            const variantName = variant ? (variant.size || variant.color || variant.sku) : undefined;

            const newItem: CartItem = {
                id: cartItemId,
                productId: product.id,
                variantId: variant?.id,
                name: product.name,
                price,
                image,
                quantity,
                variantName
            };

            return [...prevItems, newItem];
        });
    };

    const removeFromCart = (cartItemId: string) => {
        setItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
    };

    const updateQuantity = (cartItemId: string, quantity: number) => {
        if (quantity < 1) return; // No permitir 0 o negativos
        setItems(prevItems => 
            prevItems.map(item => item.id === cartItemId ? { ...item, quantity } : item)
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    // Cálculos automáticos para mostrar en el Navbar o Checkout
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart debe usarse dentro de un CartProvider");
    }
    return context;
}
