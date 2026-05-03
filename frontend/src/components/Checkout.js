import React, { useState } from "react";
import "./Checkout.css";
import { useCart } from "../context/Cartcontext";
import API from "../api";

const Checkout = () => {
  const { cartItems, getTotal } = useCart();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const needsShipping = cartItems.some(
    (item) => item.shipmentRequired
  );

  const handlePayment = async () => {
    if (needsShipping && (!address || !phone)) {
      alert("Please enter shipping details");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      // ✅ CREATE ORDER (ADMIN WILL SEE THIS)
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems,
          totalAmount: getTotal(),
          shippingRequired: needsShipping,
          shippingAddress: address,
          phone,
          paymentMode: "demo",
          paymentStatus: "completed",
        }),
      });

      if (!res.ok) throw new Error("Order failed");

      alert("Payment Successful (Demo)");

      // clear cart
      localStorage.removeItem("healink_cart");

      // redirect
      window.location.href = "/orders";
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-card">
        <h2 className="checkout-title">Checkout</h2>

        {cartItems.length === 0 ? (
          <p className="empty-cart">Your cart is empty.</p>
        ) : (
          <>
            {/* ===== ITEMS ===== */}
            <div className="checkout-items">
              {cartItems.map((item, index) => (
                <div key={index} className="checkout-item">
                  <div>
                    <strong>{item.name}</strong>
                    <span className="qty">× {item.quantity}</span>
                  </div>
                  <span className="price">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* ===== SHIPPING ===== */}
            {needsShipping && (
              <div className="shipping-box">
                <h3>Shipping Details</h3>
                <input
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <input
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            )}

            {/* ===== TOTAL ===== */}
            <div className="checkout-total">
              <span>Total</span>
              <strong>₹{getTotal()}</strong>
            </div>

            <button
              className="pay-btn"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
