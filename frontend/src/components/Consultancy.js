import React from "react";
import { useNavigate } from "react-router-dom";
import "./Section.css";


function Consultancy() {
  const navigate = useNavigate();

  return (
    <div className="section-card" onClick={() => navigate("/consultancy")}>
      <div className="icon">💻</div>
      <h3>Online Consultancy</h3>
      <p>Consult certified doctors instantly through our online platform.</p>
    </div>
  );
}

export default Consultancy;
