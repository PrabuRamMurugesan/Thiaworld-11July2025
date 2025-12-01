import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

const ChatPanel = ({ isOpen, onClose, brand, children }) => {
  const brandTitles = {
    thia: "Thia Genie",
    bbscart: "BBS Assistant",
    health: "Care Assistant",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        right: isOpen ? "0" : "-460px",
        width: "450px",
        height: "100vh",
        background: "#fff",
        boxShadow: isOpen ? "-4px 0px 20px rgba(0,0,0,0.2)" : "none",
        transition: "right 0.35s ease",
        zIndex: 9998,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "18px",
          background: "#0B7A4B",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        {brandTitles[brand] || "AI Assistant"}

        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          <IoClose size={28} />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
};

export default ChatPanel;
