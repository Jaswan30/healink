import React, { useState } from "react";
import "./Subscribe.css";
function Subscribe() {
  const [form, setForm] = useState({
    hospitalName: "",
    type: "doctor",
    name: "",
    specialty: "",
    price: "",
    location: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
  try {
    const API = import.meta.env.VITE_API_URL;

fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const text = await res.text(); // 🔥 get raw response

    let data;
    try {
      data = JSON.parse(text); // try converting to JSON
    } catch {
      throw new Error("Server returned HTML instead of JSON");
    }

    if (!res.ok) {
      throw new Error(data.error || "Something failed");
    }

    alert(data.message);
  } catch (err) {
    alert(err.message);
  }
};

  return (
    <div className="subscribe-page">
  <div className="subscribe-container">
  <h2>Join HEALink Network</h2>
    <div className="form-grid">

  <input
    className="hospital"
    name="hospitalName"
    placeholder="Hospital Name"
    onChange={handleChange}
  />

  <select
    className="type"
    name="type"
    onChange={handleChange}
  >
    <option value="doctor">Doctor</option>
    <option value="medicine">Medicine</option>
    <option value="test">Pathology</option>
    <option value="blood">Blood Bank</option>
  </select>

  <input
    className="name"
    name="name"
    placeholder="Name"
    onChange={handleChange}
  />

  <input
    className="specialty"
    name="specialty"
    placeholder="Specialty"
    onChange={handleChange}
  />

  <input
    className="price"
    name="price"
    placeholder="Price"
    onChange={handleChange}
  />

  <input
    className="location"
    name="location"
    placeholder="Location"
    onChange={handleChange}
  />

</div>
  
  <button className="subscribe-btn" onClick={submit}>
    🚀 Submit
  </button>
</div>
</div>
  );
}

export default Subscribe;