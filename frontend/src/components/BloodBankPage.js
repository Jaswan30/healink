import React, { useEffect, useMemo, useRef, useState } from "react";
import "./BloodBankPage.css";
import { useCart } from "../context/Cartcontext";

const API =
  (process.env.REACT_APP_API_BASE || "http://localhost:5000/api") + "/public";

const BloodBankPage = () => {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [centers, setCenters] = useState([]);
  const cardRefs = useRef({});

  const { addToCart } = useCart();

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const res = await fetch(`${API}/blood-centers`);
        const data = await res.json();
        if (ok) setCenters(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Blood centers fetch error:", e);
        if (ok) setCenters([]);
      }
    })();
    return () => {
      ok = false;
    };
  }, []);

  const filteredCenters = useMemo(
    () =>
      centers.filter(
        (c) =>
          (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
          (c.location || "").toLowerCase().includes(search.toLowerCase()) ||
          (Array.isArray(c.bloodTypes) ? c.bloodTypes : []).some((t) =>
            (t || "").toLowerCase().includes(search.toLowerCase())
          )
      ),
    [centers, search]
  );

  const suggestions = useMemo(
    () =>
      centers
        .flatMap((c) =>
          (Array.isArray(c.bloodTypes) ? c.bloodTypes : []).map((type) => ({
            label: `${c.name} (${type})`,
            center: c,
            bloodType: type,
          }))
        )
        .filter(
          (item) =>
            item.label.toLowerCase().includes(search.toLowerCase()) ||
            (item.center.location || "")
              .toLowerCase()
              .includes(search.toLowerCase())
        ),
    [centers, search]
  );

  const handleSuggestionClick = (s) => {
    setSearch(s.center.name || "");
    setShowSuggestions(false);
    if (cardRefs.current[s.center._id]) {
      cardRefs.current[s.center._id].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  /* ======================
     ADD TO CART (UNCHANGED)
  ====================== */
  const handleAddToCart = (center, bloodType) => {
  addToCart({
    type: "product",
    category: "blood",
    name: `${bloodType} Blood`,
    price: 1200,
    quantity: 1,
    shipmentRequired: true,
    bloodGroup: bloodType,
    centerName: center.name,
    location: center.location,
  });

  alert(`${bloodType} Blood added to cart 🛒`);
  window.dispatchEvent(new Event("open-cart"));
};


  /* ======================
     ❤️ ADD TO WISHLIST (NEW)
  ====================== */
  const addToWishlist = (center, bloodType) => {
  const saved = JSON.parse(
    localStorage.getItem("healink_wishlist") || "[]"
  );

  const itemName = `${bloodType} Blood`;

  if (saved.find((i) => i.name === itemName)) {
    alert("Already in Wishlist ❤️");
    return;
  }

  localStorage.setItem(
    "healink_wishlist",
    JSON.stringify([
      ...saved,
      {
        name: itemName,
        price: 1200,
        category: "blood",
        center: center.name,
        location: center.location,
      },
    ])
  );

  alert("Added to Wishlist ❤️");
};


  return (
    <div className="bloodbank-container">
      <h2>Available Blood Banks</h2>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search by blood type, name or location..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSuggestions(true);
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          className="modern-search-input"
        />
        <button className="modern-search-btn">Search</button>

        {showSuggestions && search && (
          <ul className="modern-suggestion-box suggestions-list">
            {suggestions.length > 0 ? (
              suggestions.map((item, idx) => (
                <li
                  key={idx}
                  className="modern-suggestion-item"
                  onClick={() => handleSuggestionClick(item)}
                >
                  <strong>{item.center.name}</strong>
                  <span className="suggestion-type">
                    ({item.center.location} •{" "}
                    {(item.center.bloodTypes || []).join(", ")})
                  </span>
                </li>
              ))
            ) : (
              <li className="modern-no-suggestion">No results found</li>
            )}
          </ul>
        )}
      </div>

      <div className="bloodbank-list">
        {filteredCenters.length > 0 ? (
          filteredCenters.map((c) => (
            <div
              key={c._id}
              ref={(el) => (cardRefs.current[c._id] = el)}
              className={`bloodbank-card ${
                c.available ? "available" : "not-available"
              }`}
            >
              <h3>{c.name}</h3>
              <p>{c.location}</p>
              <p>
                <strong>Blood Types:</strong>{" "}
                {(c.bloodTypes || []).join(", ")}
              </p>
              <span className="status">
                {c.available ? "✅ Available" : "❌ Not Available"}
              </span>

              {c.available && (
                <div style={{ marginTop: "10px" }}>
                  {(c.bloodTypes || []).map((type) => (
                    <div key={type} style={{ marginBottom: "6px" }}>
                      <button
                        style={{
                          marginRight: "8px",
                          padding: "6px 12px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleAddToCart(c, type)}
                      >
                        Add {type}
                      </button>

                      <button
                        onClick={() => addToWishlist(c, type)}
                        style={{
                          padding: "6px 12px",
                          cursor: "pointer",
                        }}
                      >
                        ♡ Wishlist
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-results">No matching results found.</p>
        )}
      </div>
    </div>
  );
};

export default BloodBankPage;
