import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Logo from "./assets/logo.jpeg";
import AdminDashboard from "./components/AdminDashboard";

import Pathology from "./components/Pathology";
import BloodBank from "./components/BloodBank";
import Consultancy from "./components/Consultancy";
import Medicine from "./components/Medicine";

import PathologyPage from "./components/PathologyPage";
import BloodBankPage from "./components/BloodBankPage";
import ConsultancyPage from "./components/ConsultancyPage";
import MedicinePage from "./components/MedicinePage";
import About from "./components/About";
import Contact from "./components/Contact";

import EditProfile from "./components/EditProfile";
import History from "./components/History";
import Orders from "./components/Orders";
import Wishlist from "./components/Wishlist";
import AIAssistant from "./components/AIAssistant";
import CartDrawer from "./components/CartDrawer";
import { useCart } from "./context/Cartcontext";
import Checkout from "./components/Checkout";
import ScrollToTop from "./components/ScrollToTop";
import Subscribe from "./components/Subscribe";


function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, isCartOpen, setIsCartOpen } = useCart();


  const slides = [
    require("./assets/hero-bg-1.jpg"),
    require("./assets/hero-bg-2.jpg"),
    require("./assets/hero-bg-3.jpg"),
    require("./assets/hero-bg-4.jpg"),
  ];

  // 🔹 NEW STATES (ONLY FOR STATS SECTION)
  const [stats, setStats] = useState({
    users: 0,
    consultations: 0,
    medicines: 0,
    bloodRequests: 0,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // 🔹 PAGE HIT COUNT DEMO ANIMATION
  useEffect(() => {
    let interval = setInterval(() => {
      setStats((prev) => ({
        users: prev.users < 12000 ? prev.users + 120 : prev.users,
        consultations:
          prev.consultations < 8500 ? prev.consultations + 85 : prev.consultations,
        medicines:
          prev.medicines < 15000 ? prev.medicines + 150 : prev.medicines,
        bloodRequests:
          prev.bloodRequests < 3200 ? prev.bloodRequests + 32 : prev.bloodRequests,
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const hideHeader =
    location.pathname === "/login" || location.pathname === "/register";
  const isHome = location.pathname === "/";

  return (
    <div className="app">
      {!hideHeader && isHome && (
        <header className="header fixed-header">
          <div className="logo-container">
            <img src={Logo} alt="HEALink Logo" className="logo" />
            <h1>HEALink</h1>
          </div>

          <nav>
            <ul>
              <li>
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li>
                <a href="#about-section" className="nav-link">About</a>
              </li>
              <li>
                <Link to="/contact" className="nav-link">Contact</Link>
              </li>
            </ul>
          </nav>

          <div className="auth-buttons">
  {user ? (
    <Profile user={user} onLogout={handleLogout} />
  ) : (
    <>
      <button className="login-btn" onClick={() => setShowLogin(true)}>
        Login
      </button>
      <button
        className="register-btn"
        onClick={() => setShowRegister(true)}
      >
        Register
      </button>
    </>
  )}

  {/* 🛒 Cart Icon */}
  <div
  className="cart-icon-wrapper"
  onClick={() => setIsCartOpen(true)}
>
  🛒
  {cartItems.length > 0 && (
    <span className="cart-badge">{cartItems.length}</span>
  )}
</div>

</div>

        </header>
      )}

      {!isHome && !hideHeader && (
        <button className="back-floating-btn" onClick={() => navigate(-1)}>
          ⬅ Back
        </button>
      )}
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <section className="hero">
                <div className="hero-content">
                  <h2>Your Health, Our Priority</h2>
                  <p>Connecting people to better healthcare solutions.</p>
                  <button
                    onClick={() =>
                      document
                        .querySelector(".sections")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="get-started-btn"
                  >
                    Get Started
                  </button>
                  <div className="subscribe-cta">
  <button
    className="subscribe-btn"
    onClick={() => navigate("/subscribe")}
  >
    🚀 Join HEALink Network
  </button>
</div>
                </div>

                <div className="hero-slider">
                  {slides.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`Slide ${index + 1}`}
                      className={`fade-slide ${
                        index === currentSlide ? "active" : ""
                      }`}
                    />
                  ))}
                </div>
              </section>

              <About />

              <section className="sections">
                <Pathology />
                <BloodBank />
                <Consultancy />
                <Medicine />
              </section>

              {/* ================= NEW STATS + FEEDBACK SECTION ================= */}
              <section className="stats-feedback-section">
                <div className="stats-container">
                  <div className="stat-card">
                    <h2>{stats.users}+</h2>
                    <p>Happy Users</p>
                  </div>
                  <div className="stat-card">
                    <h2>{stats.consultations}+</h2>
                    <p>Online Consultations</p>
                  </div>
                  <div className="stat-card">
                    <h2>{stats.medicines}+</h2>
                    <p>Medicines Delivered</p>
                  </div>
                  <div className="stat-card">
                    <h2>{stats.bloodRequests}+</h2>
                    <p>Blood Requests Served</p>
                  </div>
                </div>

                <div className="feedback-container">
                  <h2>What Everyone says!!</h2>
                  <div className="feedback-cards">
                    <div className="feedback-card">
                      ⭐⭐⭐⭐⭐
                      <p>
                        “HEALink helped me find blood within minutes. Lifesaver!”
                      </p>
                      <span>- Anil Kumar</span>
                    </div>
                    <div className="feedback-card">
                      ⭐⭐⭐⭐☆
                      <p>
                        “Online consultation was smooth and very professional.”
                      </p>
                      <span>- Priya Sharma</span>
                    </div>
                    <div className="feedback-card">
                      ⭐⭐⭐⭐⭐
                      <p>
                        “Medicine delivery was fast and packaging was perfect.”
                      </p>
                      <span>- Rahul Verma</span>
                    </div>
                  </div>
                </div>
              </section>
            </>
          }
        />
        
        <Route path="/pathology" element={<PathologyPage />} />
        <Route path="/bloodbank" element={<BloodBankPage />} />
        <Route path="/consultancy" element={<ConsultancyPage />} />
        <Route path="/medicine" element={<MedicinePage />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/history" element={<History />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/subscribe" element={<Subscribe />} />


        

      </Routes>

      {!hideHeader && (
  <footer className="footer-premium">
    <div className="footer-content">
      <div className="footer-brand">
        <h2>HEALink</h2>
        <p>
          Connecting people to trusted healthcare services — anytime, anywhere.
        </p>
      </div>

      <div className="footer-links">
        <h4>Quick Links</h4>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/consultancy">Consultancy</Link></li>
          <li><Link to="/medicine">Medicine</Link></li>
        </ul>
      </div>

      <div className="footer-contact">
        <h4>Contact</h4>
        <p>Email: support@healink.com</p>
        <p>Phone: +91 9XXXXXXXXX</p>
        <p>India</p>
      </div>
    </div>
  </footer>
)}
<AIAssistant />




      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onLoginSuccess={(userData) => {
            handleAuthSuccess(userData);
            setShowLogin(false);
          }}
        />
      )}

      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onRegisterSuccess={(userData) => {
            handleAuthSuccess(userData);
            setShowRegister(false);
          }}
        />
      )}
      {isCartOpen && <CartDrawer />}

    </div>
  );
}

export default App;
