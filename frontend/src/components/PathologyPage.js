import React, { useEffect, useMemo, useState } from "react";
import "./PathologyPage.css";
import { useCart } from "../context/Cartcontext";
import API from "../api";



/* ===== static data (UNCHANGED) ===== */
const healthCheckups = [];
const healthTests = [];
const fullBodyCheckups = [];

const PathologyPage = () => {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dbTests, setDbTests] = useState([]);

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  const { addToCart, setIsCartOpen } = useCart();

  /* ===== fetch tests ===== */
  useEffect(() => {
    let ok = true;

    (async () => {
      try {
        const res = await fetch(`${API}/tests`);
        const data = await res.json();
        if (ok) setDbTests(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Tests fetch error:", e);
        if (ok) setDbTests([]);
      }
    })();

    return () => {
      ok = false;
    };
  }, []);

  /* ===== ICON MAPPING (UI ONLY — LOGIC UNCHANGED) ===== */
  const getIcon = (title = "") => {
    const t = title.toLowerCase();

    if (t.includes("heart"))
      return "https://cdn-icons-png.flaticon.com/512/833/833472.png";

    if (t.includes("kidney"))
      return "https://cdn-icons-png.flaticon.com/512/2966/2966489.png";

    if (t.includes("blood"))
      return "https://cdn-icons-png.flaticon.com/512/2069/2069768.png";

    return "https://cdn-icons-png.flaticon.com/512/2785/2785544.png";
  };

  /* ===== normalize DB tests ===== */
  const dbCards = useMemo(
    () =>
      dbTests.map((t) => ({
        id: t._id,
        title: t.title || t.name || "Test",
        img: getIcon(t.title || t.name),
        oldPrice: t.oldPrice || t.price || 0,
        price: t.price || 0,
        discount: t.discount ? `${t.discount}% Off` : "",
        tests: t.tests || [],
        reportTime: t.reportTime || "24 hours",
        description: t.description || "",
      })),
    [dbTests]
  );

  const allItems = useMemo(
    () => [...healthCheckups, ...healthTests, ...fullBodyCheckups, ...dbCards],
    [dbCards]
  );

  const filteredItems = allItems.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const visibleItems = search ? filteredItems : allItems;

  const handleBookTest = () => {
    if (!date || !timeSlot) {
      alert("Please select date and time slot");
      return;
    }

    addToCart({
      type: "service",
      category: "pathology",
      name: selected.title,
      price: selected.price,
      quantity: 1,
      shipmentRequired: false,
      meta: {
        testId: selected.id,
        testName: selected.title,
        date,
        timeSlot,
      },
    });

    setSelected(null);
    setDate("");
    setTimeSlot("");
    setIsCartOpen(true);
  };

  return (
    <div className="pathology-page-root">
      <h1 className="page-title">Pathology — Checkups & Tests</h1>

      {/* SEARCH */}
      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for any test or package..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />
          <button>Search</button>
        </div>

        {showSuggestions && search && filteredItems.length > 0 && (
          <div className="suggestion-box">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="suggestion-item"
                onClick={() => {
                  setSelected(item);
                  setSearch("");
                  setShowSuggestions(false);
                }}
              >
                <strong>{item.title}</strong>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CARDS */}
      <div className="cards-row">
        {visibleItems.length ? (
          visibleItems.map((item) => (
            <div
              key={item.id}
              className="card"
              onClick={() => setSelected(item)}
            >
              <img src={item.img} alt={item.title} className="card-img" />
              <div className="card-title">{item.title}</div>

              <div className="card-sub">
                <span className="card-price">₹{item.price}</span>
                <span className="card-old">₹{item.oldPrice}</span>
                {item.discount && (
                  <span className="card-discount">{item.discount}</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No tests found.</p>
        )}
      </div>

      {/* MODAL */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>
              ×
            </button>

            <div className="modal-top">
              <img src={selected.img} alt="" className="modal-img" />

              <div className="modal-title-wrap">
                <div className="modal-title">{selected.title}</div>

                <div className="modal-price">
                  <span className="modal-old">₹{selected.oldPrice}</span>
                  <span className="modal-new">₹{selected.price}</span>
                </div>
              </div>
            </div>

            <div className="modal-body">
              <p className="modal-desc">{selected.description}</p>

              <div className="booking-fields">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />

                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                >
                  <option value="">Select Time Slot</option>
                  <option>08:00 - 10:00</option>
                  <option>10:00 - 12:00</option>
                  <option>12:00 - 02:00</option>
                  <option>04:00 - 06:00</option>
                </select>

                <button className="book-btn" onClick={handleBookTest}>
                  Book Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PathologyPage;