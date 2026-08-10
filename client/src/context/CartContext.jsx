import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('khf_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('khf_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, variant, quantity = 1) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.product_id === product.id && item.variant_id === variant.id
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        const maxStock = variant.stock;
        updated[existingIndex].quantity = Math.min(newQty, maxStock);
        return updated;
      } else {
        return [...prevCart, {
          product_id: product.id,
          variant_id: variant.id,
          name: product.name,
          slug: product.slug,
          weight: variant.weight,
          price: variant.price,
          mrp: variant.mrp,
          stock: variant.stock,
          image: product.images && product.images.length > 0 ? product.images[0].url : '/images/product-natural-honey.png',
          quantity: Math.min(quantity, variant.stock)
        }];
      }
    });
  };

  const removeFromCart = (variantId) => {
    setCart(prev => prev.filter(item => item.variant_id !== variantId));
  };

  const updateQuantity = (variantId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.variant_id === variantId) {
        return { ...item, quantity: Math.min(newQuantity, item.stock) };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartSubtotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
