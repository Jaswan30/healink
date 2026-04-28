// src/components/Profile.js
import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaTimes, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef();
  const navigate = useNavigate();

  // lock scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // close with ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (open && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleNavigation = (path, emptyMsg) => {
    setOpen(false);
    navigate(path, { state: { emptyMsg } });
  };

  const doLogout = () => {
    setOpen(false);
    if (typeof onLogout === "function") onLogout();
  };

  return (
    <>
      {/* Profile icon in header */}
      <div className="profile-wrapper" title="Profile">
        <FaUserCircle
          className="profile-icon"
          size={36}
          onClick={() => setOpen(true)}
        />
      </div>

      {/* overlay */}
      <div
        className={`profile-overlay ${open ? "visible" : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* sidebar */}
      <div ref={sidebarRef} className={`profile-sidebar ${open ? "open" : ""}`}>
        <button className="profile-close" onClick={() => setOpen(false)}>
          <FaTimes />
        </button>

        <div className="profile-box">
          <FaUserCircle className="profile-avatar" size={70} />
          <h3 className="profile-name">{user?.name || "User"}</h3>
          <p className="profile-email">{user?.email || "email@example.com"}</p>
        </div>

        <div className="profile-menu">
          <div
            className="profile-menu-item"
            onClick={() => handleNavigation("/edit-profile")}
          >
            <span>Profile</span>
            <FaChevronRight className="menu-arrow" />
          </div>

          <div
            className="profile-menu-item"
            onClick={() => handleNavigation("/history", "No purchase history")}
          >
            <span>History</span>
            <FaChevronRight className="menu-arrow" />
          </div>

          <div
            className="profile-menu-item"
            onClick={() => handleNavigation("/orders", "No orders yet")}
          >
            <span>Orders</span>
            <FaChevronRight className="menu-arrow" />
          </div>

          <div
            className="profile-menu-item"
            onClick={() => handleNavigation("/wishlist", "No items in wishlist")}
          >
            <span>Wishlist</span>
            <FaChevronRight className="menu-arrow" />
          </div>
        </div>

        <button className="logout-btn" onClick={doLogout}>
          Logout
        </button>
      </div>
    </>
  );
}
