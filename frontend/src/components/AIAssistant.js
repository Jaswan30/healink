import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./AIAssistant.css";

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋 How can I help you today?" }
  ]);

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  /* ✅ AUTO CLOSE ON SCROLL */
  useEffect(() => {
    const handleScroll = () => {
      setOpen(false);
    };

    if (open) window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  /* ✅ AUTO SCROLL TO LAST MESSAGE */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages([...messages, { from: "user", text: userMessage }]);
    setInput("");

    const text = userMessage.toLowerCase();

    setTimeout(() => {
      if (text.includes("blood")) {
        const match = userMessage.match(/(o\+|o-|a\+|a-|b\+|b-|ab\+|ab-)/i);
        const bloodGroup = match ? match[0].toUpperCase() : null;

        setMessages(prev => [
          ...prev,
          { from: "bot", text: "Redirecting you to Blood Bank 🩸" }
        ]);

        navigate("/bloodbank", { state: { bloodGroup } });
      } 
      else if (text.includes("medicine")) {
        setMessages(prev => [
          ...prev,
          { from: "bot", text: "Taking you to Medicine section 💊" }
        ]);
        navigate("/medicine");
      } 
      else if (text.includes("doctor") || text.includes("consult")) {
        setMessages(prev => [
          ...prev,
          { from: "bot", text: "Opening Online Consultancy 👨‍⚕️" }
        ]);
        navigate("/consultancy");
      } 
      else {
        setMessages(prev => [
          ...prev,
          {
            from: "bot",
            text: "I can help with blood, medicines, or doctor consultation 😊"
          }
        ]);
      }
    }, 600);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="ai-fab" onClick={() => setOpen(!open)}>
        🤖
      </div>

      {open && (
        <div className="ai-chatbox">
          {/* ✅ HEADER WITH CLOSE BUTTON */}
          <div className="ai-header">
            HEALink Assistant
            <span className="ai-close" onClick={() => setOpen(false)}>
              ✕
            </span>
          </div>

          <div className="ai-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-message ${msg.from}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-input">
            <input
              type="text"
              value={input}
              placeholder="Type your request..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;