// src/components/ConfirmDialog.jsx
import React from "react";

export default function ConfirmDialog({
  title,
  message,
  confirmText = "Confirm",
  onCancel,
  onConfirm,
  extraActionLabel,
  onExtraAction,
}) {
  return (
    <div style={backdrop}>
      <div style={card}>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <p style={{ marginTop: 8 }}>{message}</p>
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            marginTop: 16,
          }}
        >
          {extraActionLabel && (
            <button onClick={onExtraAction} style={{ background: "#ffe7e7" }}>
              {extraActionLabel}
            </button>
          )}
          <button onClick={onCancel}>Cancel</button>
          <button
            onClick={onConfirm}
            style={{ background: "#f33", color: "#fff" }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

const backdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};
const card = {
  width: 420,
  background: "#fff",
  borderRadius: 10,
  padding: 16,
  boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
};
