// src/components/Pagination.jsx
import React from "react";

export default function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button onClick={onPrev} disabled={page <= 1}>
        Prev
      </button>
      <span>
        Page {page} / {totalPages}
      </span>
      <button onClick={onNext} disabled={page >= totalPages}>
        Next
      </button>
    </div>
  );
}
