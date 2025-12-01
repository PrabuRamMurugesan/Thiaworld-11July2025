import React from "react";
import { FaRobot } from "react-icons/fa";

const ChatFloatingButton = ({ onClick, brand }) => {
  const brandColors = {
    thia: "#C19A6B", // Gold tone
    bbscart: "#0B7A4B", // Green tone
    health: "#1A73E8", // Medical blue
  };

  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: "25px",
        right: "25px",
        zIndex: 9999,
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        backgroundColor: brandColors[brand] || "#0B7A4B",
        border: "none",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
        cursor: "pointer",
      }}
    >
      <FaRobot size={28} color="white" />
    </button>
  );
};

export default ChatFloatingButton;
