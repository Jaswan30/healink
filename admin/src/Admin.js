import React, { useEffect, useState } from "react";
import "./Admin.css";
import API from "../api";
// Assuming authFetch is a wrapper around fetch that adds the Auth header
// If it's not defined, we'll use a fallback logic inside the component.
import { authFetch } from "./lib/api"; 

const BASE_URL = API;

/* ================= AUTH GUARD ================= */

function Guard({ children }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  
  // Get auth state
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("authToken");
  const isAuthenticated = token && user?.role === "admin";

  const doLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch(`${BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("authToken", data.token);

      window.location.reload(); 
    } catch (err) {
      setMsg(err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-wrap">
        <form onSubmit={doLogin} className="login-card">
          <h2>Admin Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {msg && <p className="error" style={{color: 'red'}}>{msg}</p>}
        </form>
      </div>
    );
  }

  return children;
}

/* ================= SECTION COMPONENT ================= */

function Section({ title, endpoint, fields }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
  const [csvFile, setCsvFile] = useState(null);

  const load = React.useCallback(async () => {
  try {
    const res = await authFetch(`/admin/${endpoint}`);
    const data = await res.json();
    setItems(data);
  } catch (err) {
    console.error(`Load error in ${title}:`, err);
  }
}, [endpoint, title]);

  useEffect(() => {
    load();
  }, [endpoint,load]); // Reload if endpoint changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editId ? `/admin/${endpoint}/${editId}` : `/admin/${endpoint}`;
      const method = editId ? "PUT" : "POST";

      const res = await authFetch(url, {
        method: method,
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setForm({});
        setEditId(null);
        load();
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setForm(item);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await authFetch(`/admin/${endpoint}/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const uploadCSV = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setCsvFile(file.name);

  const token = localStorage.getItem("authToken");

  const formData = new FormData();
  formData.append("file", file);

  try {
    await fetch(`${API}/api/bulk-upload/${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    alert("CSV uploaded successfully");
    load();
  } catch (err) {
    console.error(err);
    alert("CSV upload failed");
  }
};

  return (
    <section className="section" style={{ marginBottom: "40px", borderBottom: "1px solid #eee" }}>
      <h3>{title}</h3>

      <form onSubmit={handleSubmit} className="form-row">
        {fields.map((f) => (
          <input
            key={f.name}
            placeholder={f.name.toUpperCase()}
            value={form[f.name] || ""}
            onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
            required
          />
        ))}
        <button type="submit">{editId ? "Update" : "Add New"}</button>
        {editId && <button type="button" onClick={() => {setEditId(null); setForm({});}}>Cancel</button>}
      </form>

      <div className="csv-upload" style={{ margin: "15px 0" }}>
        <label>Bulk Upload (CSV): </label>
        <div style={{ marginBottom: "15px" }}>
  <input type="file" accept=".csv" onChange={uploadCSV} />

  {csvFile && (
    <div style={{ marginTop: "8px" }}>
      <span>Uploaded: {csvFile}</span>

      <button
        style={{ marginLeft: "10px" }}
        onClick={() => setCsvFile(null)}
      >
        Remove CSV
      </button>
    </div>
  )}
</div>
      </div>

      <div className="list">
        {items.length === 0 ? <p>No items found.</p> : items.map((item) => (
          <div key={item._id} className="list-item" style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#f9f9f9", marginBottom: "5px" }}>
            <span><strong>{item.name || item.title || item.centerName}</strong></span>
            <div className="actions">
              <button onClick={() => startEdit(item)}>Edit</button>
              <button className="danger" onClick={() => handleDelete(item._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= MAIN LAYOUT ================= */

export default function Admin() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Guard>
      <div className="admin-layout" style={{ display: "flex" }}>
        <aside className="sidebar" style={{ width: "250px", padding: "20px", background: "#2c3e50", color: "white", minHeight: "100vh" }}>
          <h2>HEALink Admin</h2>
          <button onClick={handleLogout} style={{ marginTop: "20px", width: "100%" }}>Logout</button>
        </aside>

        <main className="content" style={{ flex: 1, padding: "20px" }}>
          <Section
            title="Doctors"
            endpoint="doctors"
            fields={[{ name: "name" }, { name: "specialty" }, { name: "languages" }]}
          />
          <Section
            title="Medicines"
            endpoint="medicines"
            fields={[{ name: "name" }, { name: "price" }, { name: "discount" }]}
          />
          <Section
            title="Pathology Tests"
            endpoint="tests"
            fields={[{ name: "title" }, { name: "price" }]}
          />
          <Section
            title="Blood Banks"
            endpoint="bloodbanks"
            fields={[{ name: "centerName" }, { name: "location" }, { name: "bloodTypes" }]}
          />
        </main>
      </div>
    </Guard>
  );
}