// EditProfile.js
import React, { useEffect, useRef, useState } from "react";
import "./EditProfile.css";

const API_BASE = (process.env.REACT_APP_API_BASE || "http://localhost:5000/api")
  .replace(/\/+$/, "");

const authHeader = () => {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
};

// small helper that tries multiple paths (first that works wins)
async function tryPaths({ method = "GET", paths, body, isMultipart = false }) {
  let lastErr;
  for (const p of paths) {
    try {
      const res = await fetch(`${API_BASE}${p}`, {
        method,
        credentials: "include",
        headers: isMultipart ? { ...authHeader() } : { "Content-Type": "application/json", ...authHeader() },
        body: isMultipart ? body : body ? JSON.stringify(body) : undefined,
      });
      if (res.ok) {
        const ct = res.headers.get("content-type") || "";
        return ct.includes("application/json") ? await res.json() : {};
      }
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("Request failed");
}

export default function EditProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    lat: "",
    lng: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [preview, setPreview] = useState("");
  const fileRef = useRef(null);

  const setVal = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // LOAD profile
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // 🔑 first choice is /api/profile/me (the routes you added)
        const data = await tryPaths({
          paths: ["/profile/me", "/auth/me", "/users/me", "/me"],
        });
        const u = data.user || data || {};
        const ls = JSON.parse(localStorage.getItem("user") || "{}");

        if (!alive) return;
        setForm((f) => ({
          ...f,
          name: u.name || ls.name || "",
          email: u.email || ls.email || "",
          phone: u.phone || "",
          addressLine1: u.address?.line1 || "",
          addressLine2: u.address?.line2 || "",
          city: u.address?.city || "",
          state: u.address?.state || "",
          zip: u.address?.zip || "",
          country: u.address?.country || "",
          lat: u.location?.lat ?? "",
          lng: u.location?.lng ?? "",
          avatarUrl: u.avatarUrl || ls.avatarUrl || "",
        }));
        setPreview(u.avatarUrl || ls.avatarUrl || "");
      } catch (e) {
        const ls = JSON.parse(localStorage.getItem("user") || "{}");
        setForm((f) => ({ ...f, email: ls.email || "" }));
        setError("Failed to load profile.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // SAVE profile
  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMsg("");
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: {
          line1: form.addressLine1.trim(),
          line2: form.addressLine2.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          zip: form.zip.trim(),
          country: form.country.trim(),
        },
        location: form.lat && form.lng ? { lat: Number(form.lat), lng: Number(form.lng) } : undefined,
      };

      // 🔑 PUT /api/profile/me first
      const updated = await tryPaths({
        method: "PUT",
        paths: ["/profile/me", "/auth/me", "/users/me", "/profile"],
        body: payload,
      });

      const ls = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...ls, name: updated.name || payload.name, avatarUrl: updated.avatarUrl || ls.avatarUrl })
      );
      setMsg("Profile saved ✔");
    } catch (e) {
      setError(e.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  // UPLOAD avatar
  const onPick = async (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    const local = URL.createObjectURL(file);
    setPreview(local);
    setError("");
    setMsg("");
    const fd = new FormData();
    fd.append("avatar", file);
    try {
      const data = await tryPaths({
        method: "POST",
        paths: ["/profile/avatar", "/auth/avatar", "/users/avatar"],
        body: fd,
        isMultipart: true,
      });
      const url = data?.avatarUrl || "";
      if (url) {
        setPreview(url);
        setVal("avatarUrl", url);
        const ls = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...ls, avatarUrl: url }));
      }
      setMsg("Photo updated ✔");
    } catch (e) {
      setError(e.message || "Upload failed.");
      setPreview(form.avatarUrl || "");
    }
  };

  const grabLoc = () => {
    if (!navigator.geolocation) return setError("Geolocation not supported.");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setVal("lat", pos.coords.latitude.toFixed(6));
        setVal("lng", pos.coords.longitude.toFixed(6));
        setMsg("Location captured.");
      },
      () => setError("Could not fetch your location."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  if (loading) return <div className="profile-wrap"><div className="card">Loading…</div></div>;

  return (
    <div className="profile-wrap">
      <div className="card">
        <div className="top">
          <div className="avatar">
            <img
              src={
                preview ||
                "https://ui-avatars.com/api/?name=" + encodeURIComponent(form.name || "User")
              }
              alt="avatar"
            />
            <button type="button" className="btn outline small" onClick={() => fileRef.current?.click()}>
              Change Photo
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick} />
          </div>
          <div className="identity">
            <div className="title">{form.name || "Your Name"}</div>
            <div className="subtitle">{form.email || ""}</div>
          </div>
        </div>

        <form className="form" onSubmit={onSave}>
          <div className="grid">
            <div className="field"><label>Name</label>
              <input value={form.name} onChange={(e) => setVal("name", e.target.value)} />
            </div>
            <div className="field"><label>Email</label>
              <input value={form.email} disabled />
              <small className="muted">Email can’t be changed</small>
            </div>
            <div className="field"><label>Phone</label>
              <input value={form.phone} onChange={(e) => setVal("phone", e.target.value)} />
            </div>
            <div className="field"><label>Address line 1</label>
              <input value={form.addressLine1} onChange={(e) => setVal("addressLine1", e.target.value)} />
            </div>
            <div className="field"><label>Address line 2</label>
              <input value={form.addressLine2} onChange={(e) => setVal("addressLine2", e.target.value)} />
            </div>
            <div className="field"><label>City</label>
              <input value={form.city} onChange={(e) => setVal("city", e.target.value)} />
            </div>
            <div className="field"><label>State</label>
              <input value={form.state} onChange={(e) => setVal("state", e.target.value)} />
            </div>
            <div className="field"><label>ZIP / PIN</label>
              <input value={form.zip} onChange={(e) => setVal("zip", e.target.value)} />
            </div>
            <div className="field"><label>Country</label>
              <input value={form.country} onChange={(e) => setVal("country", e.target.value)} />
            </div>
          </div>

          <div className="loc-row">
            <div className="field sm"><label>Latitude</label>
              <input value={form.lat} onChange={(e) => setVal("lat", e.target.value)} />
            </div>
            <div className="field sm"><label>Longitude</label>
              <input value={form.lng} onChange={(e) => setVal("lng", e.target.value)} />
            </div>
            <button type="button" className="btn ghost" onClick={grabLoc}>Use Current Location</button>
          </div>

          {error && <div className="alert error">{error}</div>}
          {msg && <div className="alert ok">{msg}</div>}

          <div className="actions">
            <button className="btn primary" type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
