import React, { useState, useEffect } from "react";
import { IoSend } from "react-icons/io5";

const BrandAIChat = ({ brand }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
const [phase, setPhase] = useState("ask_name");
const [lead, setLead] = useState({ name: "", phone: "", email: "" });

  // Brand Greetings
  const greetings = {
    thia: "Welcome to Thiaworld. I'm Thia Genie. Ask me about jewellery, designs, plans or offers.",
    bbscart:
      "Welcome to BBSCART. I'm BBS Assistant. Need help with orders, products or delivery?",
    health:
      "Welcome to BBS Global Health Access. I'm Care Assistant. I can guide you with plans, coverage and benefits.",
  };

  useEffect(() => {
    setMessages([{ sender: "ai", text: greetings[brand] }]);
  }, [brand]);

const sendMessage = async () => {
  if (!input.trim()) return;

  const userText = input.trim();

  // Show the user's message in chat
  setMessages((prev) => [...prev, { sender: "user", text: userText }]);
  setInput("");

  /* ---------------------------------------------------
     LEAD CAPTURE STEP 1 — Ask Name
  --------------------------------------------------- */
  if (phase === "ask_name") {
    setLead((prev) => ({ ...prev, name: userText }));
    setPhase("ask_phone");

    return setMessages((prev) => [
      ...prev,
      { sender: "ai", text: "Thanks! Can I have your mobile number?" },
    ]);
  }

  /* ---------------------------------------------------
     LEAD CAPTURE STEP 2 — Ask Phone
  --------------------------------------------------- */
  if (phase === "ask_phone") {
    setLead((prev) => ({ ...prev, phone: userText }));
    setPhase("ask_email");

    return setMessages((prev) => [
      ...prev,
      { sender: "ai", text: "Great! Please share your email address." },
    ]);
  }

  /* ---------------------------------------------------
     LEAD CAPTURE STEP 3 — Ask Email + Save Lead
  --------------------------------------------------- */
  if (phase === "ask_email") {
    const leadData = { ...lead, email: userText, brand };

    // Save in DB
    try {
      await fetch("http://localhost:5001/api/leads/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });
    } catch (err) {
      console.log("Lead save failed", err);
    }

    setPhase("completed");

    return setMessages((prev) => [
      ...prev,
      { sender: "ai", text: "Thank you! How can I help you today?" },
    ]);
  }

  /* ---------------------------------------------------
     NORMAL AI CHAT (after lead capture is done)
  --------------------------------------------------- */
  if (phase === "completed") {
    try {
      const res = await fetch("http://localhost:5001/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, message: userText }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: data.reply || "I couldn't process that." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Network error. Try again later." },
      ]);
    }
  }
};


useEffect(() => {
  setMessages([{ sender: "ai", text: greetings[brand] }]);
  setTimeout(() => {
    setMessages((prev) => [
      ...prev,
      { sender: "ai", text: "Before we begin, may I know your name?" },
    ]);
  }, 600);
}, [brand]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Chat Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              margin: "8px 0",
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "12px",
                maxWidth: "75%",
                background:
                  msg.sender === "user" ? "#0B7A4B" : "rgba(0,0,0,0.07)",
                color: msg.sender === "user" ? "white" : "black",
                fontSize: "14px",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div
        style={{
          display: "flex",
          padding: "12px",
          borderTop: "1px solid #ddd",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginRight: "8px",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            background: "#0B7A4B",
            border: "none",
            padding: "8px 14px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <IoSend size={20} color="white" />
        </button>
      </div>
    </div>
  );
};

export default BrandAIChat;
