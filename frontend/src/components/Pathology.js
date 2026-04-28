import React from "react";
import "./Section.css";
import { useNavigate } from "react-router-dom";

function Pathology() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/pathology"); // Redirect to the Pathology page
  };

  return (
    <div className="section-card" onClick={handleClick}>
      <div className="icon">🔬</div>
      <h3>Pathology Services</h3>
      <p>Find and book appointments with leading pathology labs for accurate diagnostics.</p>
    </div>
  );
}

export default Pathology;
