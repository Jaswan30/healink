import React, { useState, useEffect } from "react";
import ab1 from "../assets/ab-hl-1.jpg";
import ab2 from "../assets/ab-hl-2.jpeg";
import ab3 from "../assets/ab-hl-3.jpg";
import ab4 from "../assets/ab-hl-4.jpg";

/* ===== Counter Component ===== */
function Counter({ end, label, icon }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1400;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [end]);

  return (
    <div
      style={{
        flex: 1,
        minWidth: 160,
        padding: "18px 12px",
        borderRadius: 14,
        background: "#fff",
        boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: "#0e3b5f" }}>
        {count.toLocaleString()}+
      </div>
      <div style={{ fontSize: 14, color: "#555" }}>{label}</div>
    </div>
  );
}

function About() {
  const images = [ab1, ab2, ab3, ab4];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex((p) => (p + 1) % images.length);
  }, 4000);
  return () => clearInterval(interval);
}, [images.length]);
console.log("NEW BUILD TEST");
  return (
    <section
      id="about-section"
      style={{
        position: "relative",
        maxWidth: 1100,
        margin: "70px auto",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 10px 28px rgba(0,0,0,0.25)",
      }}
    >
      {/* Background Image */}
      <div style={{ height: 300, position: "relative" }}>
        <img
          src={images[currentIndex]}
          alt="About"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Text Section */}
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          padding: "30px 30px 20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#007bff",
            marginBottom: 12,
          }}
        >
          HEALink
        </h2>

        <p
          style={{
            maxWidth: 900,
            margin: "0 auto",
            fontSize: 16,
            lineHeight: 1.6,
            color: "#333",
          }}
        >
          HEALink was started with a vision to connect people with better
          healthcare solutions. We provide pathology, medicine, consultancy, and
          blood bank services to make healthcare accessible and reliable for
          everyone. Our mission is to ensure that every individual gets the care
          they need with trust and convenience.
        </p>
        
      </div>

      {/* ===== Counter Section (FIX) ===== */}
      <div
        style={{
          display: "flex",
          gap: 20,
          padding: "20px 30px 30px",
          justifyContent: "space-around",
          flexWrap: "wrap",
          background: "#f5f9ff",
        }}
      >
        <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
  <Counter end={500} label="Patients Helped" icon="🧑‍⚕️" />
  <Counter end={120} label="Doctors" icon="👨‍⚕️" />
  <Counter end={50} label="Hospitals" icon="🏥" />
</div>
      </div>
    </section>
  );
}

export default About;