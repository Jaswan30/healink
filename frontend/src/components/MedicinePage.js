import React, { useEffect, useMemo, useState } from "react";
import "./MedicinePage.css";
import { useCart } from "../context/Cartcontext";

const API =
  (process.env.REACT_APP_API_BASE || "http://localhost:5000/api") + "/public";

export default function MedicinePage() {
  const [query, setQuery] = useState("");
  const [all, setAll] = useState([]);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  /* ✅ EXISTING CART LOGIC (UNCHANGED) */
  const { addToCart } = useCart();

  // ===== fetch medicines =====
  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const res = await fetch(`${API}/medicines`);
        const data = await res.json();
        if (ok) setAll(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Medicines fetch error:", e);
        if (ok) setAll([]);
      }
    })();
    return () => {
      ok = false;
    };
  }, []);

  // ===== normalize =====
  const list = useMemo(
    () =>
      all.map((m) => ({
        name: m.name,
        price: Number(m.price) || 0,
        discount: Number(m.discount) || 0,
      })),
    [all]
  );

  // ===== search logic =====
  const searchMedicines = (value) => {
    const v = value.toLowerCase().trim();
    if (!v) {
      setResults([]);
      setSelected(null);
      return;
    }

    const filtered = list.filter((m) => m.name.toLowerCase() === v);
    setResults(filtered);
    setSelected({ name: value });
  };

  /* ===============================
     🛒 ADD TO CART (UPDATED ALERT)
  =============================== */
  const handleAddMedicine = (medicine) => {
    addToCart({
      type: "product",
      category: "medicine",
      name: medicine.name,
      price: medicine.price,
      quantity: 1,
      shipmentRequired: true,
      meta: {
        medicineName: medicine.name,
      },
    });

    alert(`${medicine.name} added to cart 🛒`);
    window.dispatchEvent(new Event("open-cart"));
  };

  /* ===============================
     ❤️ ADD TO WISHLIST (UPDATED ALERT)
  =============================== */
  const addToWishlist = (medicine) => {
    const saved = JSON.parse(
      localStorage.getItem("healink_wishlist") || "[]"
    );

    if (saved.find((i) => i.name === medicine.name)) {
      alert("Already in wishlist ❤️");
      return;
    }

    localStorage.setItem(
      "healink_wishlist",
      JSON.stringify([
        ...saved,
        {
          name: medicine.name,
          price: medicine.price,
          category: "medicine",
        },
      ])
    );

    alert(`${medicine.name} added to wishlist ❤️`);
  };

  return (
    <section className="medicine-page">
      <div className="hero-section">
        <h2>
          Get <span className="highlight">Medicines Fast</span> with Superfast
          Delivery in your city
        </h2>

        <div className="features">
          <div className="feature-card">💰 <span>Cash on Delivery</span></div>
          <div className="feature-card">🚚 <span>Express Delivery</span></div>
          <div className="feature-card">🔁 <span>Easy Returns</span></div>
        </div>
      </div>

      {/* ===== Search ===== */}
      <div className="search-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchMedicines(query);
            setShowSuggestions(false);
          }}
          className="search-box"
        >
          <input
            type="text"
            placeholder="Search for Medicines..."
            value={query}
            onChange={(e) => {
              const val = e.target.value;
              setQuery(val);
              setShowSuggestions(true);
              searchMedicines(val);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />
          <button type="submit">Search</button>
        </form>

        {showSuggestions && query && results.length > 0 && (
          <ul className="suggestions">
            {results.map((item, i) => (
              <li
                key={i}
                onClick={() => {
                  setQuery(item.name);
                  setSelected(item);
                  setShowSuggestions(false);
                }}
              >
                <div className="suggestion-item">
                  <span className="suggestion-name">{item.name}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* ===== Offers (UNCHANGED) ===== */}
        <div className="offers">
          <div className="offer-box app-offer">
            <h4>APP ONLY OFFER</h4>
            <p>
              Get <strong>25% OFF</strong> on order above Rs 1000
            </p>
            <p>on medicine & healthcare</p>
            <button className="install-btn">Install App 📱</button>
          </div>

          <div className="offer-box web-offer">
            <h4>WEBSITE OFFER</h4>
            <p>
              Get <strong>23% OFF</strong> on medicine orders
            </p>
            <button className="coupon-btn">CODE: 23NUFIT</button>
          </div>
        </div>
      </div>

      {/* ===== Results ===== */}
      {selected && (
        <div className="results">
          <h3>
            Showing results for <strong>{query}</strong>
          </h3>

          <div className="result-list">
            {results.length ? (
              results.map((m, i) => (
                <div key={i} className="result-card">
                  <div className="med-info">
                    <h4>{m.name}</h4>
                    <p>15 Tablet(s) in Strip</p>
                    <p>
                      <strong>₹{m.price}</strong>{" "}
                      <span className="off">{m.discount}% OFF</span>
                    </p>
                  </div>

                  {/* 🛒 CART BUTTON */}
                  <div className="action-buttons">
  <button
    className="add-btn"
    onClick={() => handleAddMedicine(m)}
  >
    Add To Cart
  </button>

  <button
    className="wishlist-btn"
    onClick={() => addToWishlist(m)}
  >
    ♡ Wishlist
  </button>
</div>

                </div>
              ))
            ) : (
              <p>No medicine found.</p>
            )}
          </div>

          <div className="prescription">
            <h4>🧾 What is a valid prescription?</h4>
            <ul>
              <li>Doctor Details</li>
              <li>Date of Prescription</li>
              <li>Patient Details</li>
              <li>Dosage Details</li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
