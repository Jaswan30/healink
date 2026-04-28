import React from "react";
import "./CartDrawer.css";
import { useCart } from "../context/Cartcontext";
import { useNavigate } from "react-router-dom";

export default function CartDrawer() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotal,
    setIsCartOpen,
  } = useCart();

  const navigate = useNavigate();

  if (!cartItems.length) {
  return (
    <div className="cart-drawer">
      <div className="cart-header">
        <h3>Your Cart</h3>
        <button onClick={() => setIsCartOpen(false)}>✕</button>
      </div>
      <p>Your cart is empty.</p>
    </div>
  );
}

  

  return (
    <div className="cart-drawer">
      <div className="cart-header">
        <h3>Your Cart</h3>
        <button onClick={() => setIsCartOpen(false)}>✕</button>

      </div>

      <div className="cart-items">
        {cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <div className="cart-item-info">
              <strong>{item.name}</strong>
              <p>₹{item.price}</p>

              {/* ✅ QUANTITY CONTROLS */}
              <div className="qty-controls">
                <button onClick={() => updateQuantity(index, item.quantity - 1)}>
                  −
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(index, item.quantity + 1)}>
                  +
                </button>
              </div>
            </div>

            <button
              className="remove-btn"
              onClick={() => removeFromCart(index)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* ✅ TOTAL FIX */}
      <div className="cart-footer">
        <h4>Total: ₹{getTotal()}</h4>

        <button
          className="checkout-btn"
          onClick={() => {
            setIsCartOpen(false);
            navigate("/checkout");
          }}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
