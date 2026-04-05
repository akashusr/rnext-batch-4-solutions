"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface CartContextType {
    cartCount: number;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
    cartCount: 0,
    refreshCart: async () => { },
});

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [cartCount, setCartCount] = useState(0);

    const refreshCart = useCallback(async () => {
        if (!session) {
            setCartCount(0);
            return;
        }
        try {
            const res = await fetch("/api/cart");
            if (res.ok) {
                const cart = await res.json();
                const count = cart.items?.reduce(
                    (total: number, item: any) => total + (item.quantity || 1),
                    0
                ) || 0;
                setCartCount(count);
            }
        } catch (error) {
            console.error("Error fetching cart count:", error);
        }
    }, [session]);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    return (
        <CartContext.Provider value={{ cartCount, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
