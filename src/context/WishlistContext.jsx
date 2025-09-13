import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

// Crea el contexto
const WishlistContext = createContext();

// Hook para consumir el contexto
export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  // Funcionamiento: Asegura que el hook se use dentro de WishlistProvider.
  if (!ctx) throw new Error('useWishlist debe usarse dentro de WishlistProvider');
  return ctx;
};

// Proveedor del contexto
export function WishlistProvider({ children }) {
  const { user } = useUser();
  const [wishlist, setWishlist] = useState([]);

  // Cargar wishlist del localStorage por usuario al iniciar sesión
  useEffect(() => {
    if (user && user.id) {
      const stored = localStorage.getItem(`wishlist_${user.id}`);
      setWishlist(stored ? JSON.parse(stored) : []);
    } else {
      setWishlist([]);
    }
  }, [user]);

  // Guardar wishlist en localStorage cuando cambia
  useEffect(() => {
    if (user && user.id) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  // Agregar producto a la wishlist
  const addToWishlist = (product) => {
    return new Promise((resolve) => {
      setWishlist((prev) => {
        if (prev.find((item) => item.id === product.id)) return prev;
        return [...prev, product];
      });
      resolve();
    });
  };

  // Remover producto de la wishlist
  const removeFromWishlist = (productId) => {
    return new Promise((resolve) => {
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
      resolve();
    });
  };

  // Verificar si un producto está en la wishlist
  const isInWishlist = (product) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}