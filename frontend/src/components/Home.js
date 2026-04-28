import React from "react";
import Pathology from "./Pathology";
import Medicine from "./Medicine";
import BloodBank from "./BloodBank";
import Consultancy from "./Consultancy";

// Import hero image
import heroImage from "../assets/hero-bg.png"; // adjust path if Home.js is in src/

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-left">
          <h2>Your Health, Our Priority</h2>
          <p>Connecting people to better healthcare solutions.</p>
          <button
            className="get-started-btn"
            onClick={() =>
              document.querySelector(".sections")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Get Started
          </button>
        </div>

        <div className="hero-right">
          <img src={heroImage} alt="Hero" />
        </div>
      </section>

      {/* Sections */}
      <section className="sections">
        <Pathology />
        <BloodBank />
        <Consultancy />
        <Medicine />
      </section>

      {/* Styles directly in same file */}
      <style>{`
        .hero-section {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          padding: 60px 80px;
          background: linear-gradient(135deg, #007bff, #00c6ff);
          color: white;
          min-height: 500px;
          box-sizing: border-box;
          margin-bottom: 60px;
        }
        .hero-left {
          flex: 1 1 400px;
          padding-right: 40px;
          min-width: 280px;
        }
        .hero-right {
          flex: 1 1 300px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-width: 260px;
          margin-top: 20px;
        }
        .hero-right img {
          width: 380px;
          max-width: 100%;
          height: auto;
          object-fit: contain;
        }
        .get-started-btn {
          margin-top: 20px;
          padding: 12px 28px;
          font-size: 16px;
          background-color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          color: #007bff;
          font-weight: bold;
        }
        .sections {
          margin-top: 40px;
        }
        /* Responsive - on small screens stack vertically */
        @media (max-width: 768px) {
          .hero-section {
            flex-direction: column;
            text-align: center;
          }
          .hero-left {
            padding-right: 0;
          }
          .hero-right {
            margin-top: 30px;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
