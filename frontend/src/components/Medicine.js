import React from "react";
import { useNavigate } from "react-router-dom";
import "./Section.css";

function Medicine() {
  const navigate = useNavigate();

  return (
    <div className="section-card" onClick={() => navigate("/medicine")}>
      <div className="icon">💊</div>
      <h3>Medicine Delivery</h3>
      <p>Order medicines online from trusted pharmacies with home delivery.</p>
    </div>
  );
}

export default Medicine;
