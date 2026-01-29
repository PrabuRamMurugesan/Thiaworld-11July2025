import React from "react";
import { FaRobot } from "react-icons/fa";
import { RiRobot3Line } from "react-icons/ri";
const ChatFloatingButton = ({ onClick, brand, position = "bottom-right" }) => {
  const brandColors = {
    thia: "#C19A6B",
    bbscart: "#0B7A4B",
    health: "#1A73E8",
  };

  // Updated positions (moved a little inside UI)
  const positions = {
    "bottom-right": { bottom: "80px", right: "70px" }, // moved 15px left
    "bottom-left": { bottom: "50px", left: "40px" },
    "top-right": { top: "30px", right: "40px" },
    "top-left": { top: "30px", left: "40px" },
  };

  return (
<button
  onClick={onClick}
   onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
  style={{
    position: "fixed",
    zIndex: 99,
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#000000",
    border: "none",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
    cursor: "pointer",
    transition: "all 0.3s ease",
transition: "transform 0.3s ease",
    // 🔥 CENTER ICON
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    ...positions[position],
  }}
>
  <RiRobot3Line size={32} color="white" />
</button>

  );
};

export default ChatFloatingButton;
