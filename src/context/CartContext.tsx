import React, { createContext, useContext, useState, useEffect } from "react";
import { MenuItem, CartItem, Order } from "../types";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface CartContextType {
  cart: CartItem[];
  activeTableId: string | null;
  setTableId: (id: string | null) => void;
  addToCart: (item: MenuItem, qty?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  placeOrder: (paymentMethod: string) => Promise<Order>;
  toasts: Toast[];
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const local = localStorage.getItem("restoflow_cart");
    return local ? JSON.parse(local) : [];
  });
  const [activeTableId, setActiveTableId] = useState<string | null>(() => {
    return localStorage.getItem("restoflow_table");
  });
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem("restoflow_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (activeTableId) {
      localStorage.setItem("restoflow_table", activeTableId);
    } else {
      localStorage.removeItem("restoflow_table");
    }
  }, [activeTableId]);

  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove toast after 4000ms
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setTableId = (id: string | null) => {
    setActiveTableId(id);
    if (id) {
      addToast(`Table ${id} attached to session!`, "info");
    }
  };

  const addToCart = (item: MenuItem, qty = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.id === item.id);
      if (existing) {
        addToast(`Updated quantity of ${item.name} in your cart!`, "success");
        return prevCart.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + qty } : c
        );
      }
      addToast(`Added ${item.name} to your cart!`, "success");
      return [...prevCart, { ...item, qty }];
    });
  };

  const removeFromCart = (id: number) => {
    const item = cart.find(c => c.id === id);
    if (item) {
      addToast(`Removed ${item.name} from your cart.`, "info");
    }
    setCart((prevCart) => prevCart.filter((c) => c.id !== id));
  };

  const updateQuantity = (id: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((c) => (c.id === id ? { ...c, qty } : c))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.qty, 0);
  const cartCount = cart.reduce((count, item) => count + item.qty, 0);

  const placeOrder = async (paymentMethod: string): Promise<Order> => {
    if (cart.length === 0) {
      const err = new Error("Cart is empty");
      addToast("Your cart is empty!", "error");
      throw err;
    }

    const payload = {
      tableId: activeTableId || "Takeaway",
      items: cart.map((c) => ({
        name: c.name,
        qty: c.qty,
        price: c.price,
      })),
      total: cartTotal,
      paymentMethod,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to place order in backend database.");
      }

      const newOrder: Order = await response.json();
      clearCart();
      addToast(`Order ${newOrder.orderId} placed successfully!`, "success");
      return newOrder;
    } catch (err: any) {
      console.error(err);
      addToast("Failed to connect to the ordering backend.", "error");
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        activeTableId,
        setTableId,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        placeOrder,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
