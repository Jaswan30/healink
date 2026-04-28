import React, { useEffect, useMemo, useState } from "react";
import "./ConsultancyPage.css";
import { useCart } from "../context/Cartcontext";

const API =
  (process.env.REACT_APP_API_BASE || "http://localhost:5000/api") + "/public";

function ConsultancyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");

  const { addToCart, setIsCartOpen } = useCart();

  // ===== load doctors =====
  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const res = await fetch(`${API}/doctors`);
        const data = await res.json();
        if (ok) setDoctors(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Doctors fetch error:", e);
        if (ok) setDoctors([]);
      }
    })();
    return () => {
      ok = false;
    };
  }, []);

  // ===== group by specialty =====
  const doctorsData = useMemo(() => {
    const map = {};
    doctors.forEach((d) => {
      const key = d.specialty || "General";
      if (!map[key]) map[key] = [];
      map[key].push({
        id: d._id,
        name: d.name,
        img:
          d.photo ||
          "https://cdn.pixabay.com/photo/2016/03/31/20/11/doctor-1295568_960_720.png",
        details: d.details || d.specialty || "",
        languages: Array.isArray(d.languages)
          ? `Speaks ${d.languages.join(", ")}`
          : "",
        fee: Number(d.fee) || 700,
      });
    });
    return map;
  }, [doctors]);

  // ===== suggestions =====
  const allDoctors = useMemo(
    () =>
      Object.keys(doctorsData).flatMap((category) =>
        doctorsData[category].map((doc) => ({ ...doc, category }))
      ),
    [doctorsData]
  );

  const suggestions = allDoctors.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSuggestionClick = (doctor) => {
    setActiveDropdown(doctor.category);
    setSearchQuery(doctor.name);
    setShowSuggestions(false);
    const section = document.getElementById(
      doctor.category.replace(/\s+/g, "-")
    );
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // ===== BOOK CONSULTATION (STEP-4 CORE) =====
  const handleBookConsultation = () => {
    if (!date || !slot) {
      alert("Please select date and time slot");
      return;
    }

    addToCart({
      type: "service",
      category: "consultancy",
      name: selectedDoctor.name,
      price: selectedDoctor.fee,
      quantity: 1,
      meta: {
        doctorId: selectedDoctor.id,
        date,
        slot,
      },
    });

    setSelectedDoctor(null);
    setDate("");
    setSlot("");
    setIsCartOpen(true);
  };

  return (
    <div className="consultancy-page">
      <div className="consultancy-header">
        <h1>Our Doctors</h1>
        <p>
          We have handpicked some of the best doctors in key specialties.
          Whether you’re looking for a General Physician or a Pediatrician —
          you’ll find trusted professionals here.
        </p>

        {/* ===== Search ===== */}
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search doctor name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
            />
            <button onClick={() => setShowSuggestions(false)}>Search</button>
          </div>

          {showSuggestions && searchQuery && (
            <ul className="suggestions-list">
              {suggestions.length > 0 ? (
                suggestions.map((doc, index) => (
                  <li key={index} onClick={() => handleSuggestionClick(doc)}>
                    <strong>{doc.name}</strong>{" "}
                    <span>({doc.category})</span>
                  </li>
                ))
              ) : (
                <li className="no-suggestion">No doctor found</li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* ===== Doctor Sections ===== */}
      <div className="doctor-sections">
        {Object.keys(doctorsData).length === 0 && (
          <p className="no-results">No doctors added yet.</p>
        )}

        {Object.keys(doctorsData).map((category, index) => (
          <div
            key={index}
            id={category.replace(/\s+/g, "-")}
            className="doctor-category"
          >
            <div
              className="category-header"
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === category ? null : category
                )
              }
            >
              <h2>{category}</h2>
              <span className={`arrow ${activeDropdown === category ? "open" : ""}`}>
                ▼
              </span>
            </div>

            {activeDropdown === category && (
              <div className="doctor-list">
                {doctorsData[category].map((doc, i) => (
                  <div className="doctor-card" key={i}>
                    <img src={doc.img} alt={doc.name} />
                    <div className="doctor-info">
                      <h3>{doc.name}</h3>
                      <p>{doc.details}</p>
                      <p className="languages">{doc.languages}</p>
                      <div className="consultation">
                        <span>₹{doc.fee} per consultation</span>
                        <div className="buttons">
                          <button className="view-btn">View Profile</button>
                          <button
                            className="book-btn"
                            onClick={() => setSelectedDoctor(doc)}
                          >
                            Book Appointment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ===== BOOKING MODAL (STEP-4 ADDITION) ===== */}
      {selectedDoctor && (
        <div className="modal-overlay" onClick={() => setSelectedDoctor(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedDoctor(null)}>
              ×
            </button>

            <h3>{selectedDoctor.name}</h3>
            <p>{selectedDoctor.details}</p>

            <div className="booking-fields">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <select value={slot} onChange={(e) => setSlot(e.target.value)}>
                <option value="">Select Time Slot</option>
                <option>09:00 AM – 10:00 AM</option>
                <option>10:00 AM – 11:00 AM</option>
                <option>11:00 AM – 12:00 PM</option>
                <option>06:00 PM – 07:00 PM</option>
                <option>07:00 PM – 08:00 PM</option>
              </select>

              <button className="book-btn" onClick={handleBookConsultation}>
                Confirm & Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsultancyPage;
