// src/components/Contact.js
import React from "react";

const Contact = () => {
  return (
    <div style={styles.contactPage}>
      <h2 style={styles.heading}>Contact Us</h2>
      <p style={styles.subText}>
        We’d love to hear from you! Reach out using the details below.
      </p>

      <div style={styles.contactContainer}>
        <div style={styles.card}>
          <h4 style={styles.title}>📧 Email</h4>
          <p style={styles.info}>support@healink.com</p>
        </div>

        <div style={styles.card}>
          <h4 style={styles.title}>📞 Phone</h4>
          <p style={styles.info}>+91 98765 43210</p>
        </div>

        <div style={styles.card}>
          <h4 style={styles.title}>📍 Address</h4>
          <p style={styles.info}>
            HEALink Headquarters,<br />Hyderabad, India
          </p>
        </div>
      </div>

      <div style={styles.formContainer}>
        <h3 style={styles.formTitle}>Send Us a Message</h3>
        <form style={styles.form}>
          <input type="text" placeholder="Your Name" style={styles.input} />
          <input type="email" placeholder="Your Email" style={styles.input} />
          <textarea placeholder="Your Message" rows="4" style={styles.textarea}></textarea>
          <button type="submit" style={styles.button}>Send Message</button>
        </form>
      </div>
    </div>
  );
};

// Inline Styles
const styles = {
  contactPage: {
    padding: "80px 10%",
    background: "#f9fafb",
    minHeight: "90vh",
    textAlign: "center",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#007bff",
    marginBottom: "10px",
  },
  subText: {
    fontSize: "1.1rem",
    color: "#555",
    marginBottom: "40px",
  },
  contactContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "30px",
    marginBottom: "50px",
  },
  card: {
    background: "white",
    borderRadius: "15px",
    padding: "25px 35px",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
    width: "280px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  title: {
    color: "#007bff",
    fontSize: "1.2rem",
    marginBottom: "8px",
  },
  info: {
    color: "#444",
    fontSize: "1rem",
  },
  formContainer: {
    background: "white",
    padding: "40px 30px",
    borderRadius: "20px",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    margin: "0 auto",
  },
  formTitle: {
    color: "#007bff",
    fontSize: "1.5rem",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  textarea: {
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    resize: "none",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.3s ease, transform 0.2s ease",
  },
};

export default Contact;
