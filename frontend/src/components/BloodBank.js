import React from "react";
import { useNavigate } from "react-router-dom";
import "./Section.css";

function BloodBank() {
  const navigate = useNavigate();

  return (
    <div className="section-card" onClick={() => navigate("/bloodbank")}>
      <div className="icon">🩸</div>
      <h3>Blood Bank</h3>
      <p>Find blood banks and check availability of blood groups in real time.</p>
    </div>
  );
}

export default BloodBank;
