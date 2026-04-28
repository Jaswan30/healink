import React, { useEffect, useState } from "react";
import { useCart } from "../context/Cartcontext";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { addToCart, setIsCartOpen } = useCart();

  // ✅ load wishlist ONCE
  useEffect(() => {
    const saved = localStorage.getItem("healink_wishlist");
    setWishlist(saved ? JSON.parse(saved) : []);
  }, []);

  const persist = (data) => {
    localStorage.setItem("healink_wishlist", JSON.stringify(data));
    setWishlist(data);
  };

  const removeFromWishlist = (index) => {
    const updated = wishlist.filter((_, i) => i !== index);
    persist(updated);
  };

  const moveToCart = (item, index) => {
    addToCart(item);
    removeFromWishlist(index);
    setIsCartOpen(true);
  };

  return (
    <div className="wishlist-page">
      {/* ===== INLINE CSS ===== */}
      <style>{`
        .wishlist-page {
          padding: 40px 8%;
          min-height: 70vh;
          background: #f6f8fb;
        }

        h2 {
          font-size: 28px;
          margin-bottom: 30px;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }

        .wishlist-card {
          background: #fff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
          transition: transform 0.25s ease;
        }

        .wishlist-card:hover {
          transform: translateY(-4px);
        }

        .item-name {
          font-weight: 600;
          margin-bottom: 8px;
        }

        .item-price {
          color: #007bff;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .wishlist-actions {
          display: flex;
          gap: 10px;
        }

        .add-btn, .remove-btn {
          flex: 1;
          padding: 8px 12px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }

        .add-btn {
          background: #007bff;
          color: white;
        }

        .remove-btn {
          background: #eee;
          color: #333;
        }

        .empty {
          color: #666;
          font-size: 16px;
        }
      `}</style>

      <h2>My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="empty">Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item, index) => (
            <div key={index} className="wishlist-card">
              <div className="item-name">{item.name}</div>
              <div className="item-price">₹{item.price}</div>

              <div className="wishlist-actions">
                <button
                  className="add-btn"
                  onClick={() => moveToCart(item, index)}
                >
                  Add to Cart
                </button>

                <button
                  className="remove-btn"
                  onClick={() => removeFromWishlist(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
