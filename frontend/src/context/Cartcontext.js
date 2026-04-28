import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ✅ load cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("healink_cart");
    return saved ? JSON.parse(saved) : [];
  });

  // ❗ cart is CLOSED by default
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ✅ persist cart on every change
  useEffect(() => {
    localStorage.setItem("healink_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.name === item.name && i.category === item.category
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      return [...prev, { ...item, quantity: 1 }];
    });

    // ❌ REMOVED auto-open (THIS was the bug)
    // setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, qty) => {
    if (qty < 1) return;
    setCartItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: qty } : item
      )
    );
  };

  const getTotal = () =>
    cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotal,
        isCartOpen,
        setIsCartOpen, // UI controls cart open/close
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
