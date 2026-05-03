import React, { useState } from "react";
import "./Auth.css";

function Register({ onClose, onRegisterSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const API = import.meta.env.VITE_API_URL;

    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Registered successfully!");
      onRegisterSuccess(data.user);
      onClose();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Could not connect to server");
  }
};

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
          <button type="button" className="close-btn" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;