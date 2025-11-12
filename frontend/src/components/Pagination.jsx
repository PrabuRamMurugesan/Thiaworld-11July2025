// src/components/Pagination.jsx
import React from "react";

export default function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="flex justify-around p-3">
      <button className="btn " onClick={onPrev} disabled={page <= 1}>
        Prev
      </button>
      <span>
        Page {page} / {totalPages}
      </span>
      <button className="btn" onClick={onNext} disabled={page >= totalPages}>
        Next
      </button>
    </div>
  );
}
