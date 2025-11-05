// src/components/CopyButton.jsx
import React from "react";

export default function CopyButton({ text, label = "Copy", disabled = false }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(text || "");
      alert("Copied");
    } catch {
      alert("Copy failed");
    }
  }
  return (
    <button onClick={copy} disabled={disabled || !text}>
      {label}
    </button>
  );
}
