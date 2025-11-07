// src/components/MediaGridItem.jsx
import React from "react";
import CopyButton from "./CopyButton";

export default function MediaGridItem({
  item,
  selected,
  onSelect,
  onEdit,
  onDelete,
}) {
  const isVideo = item.type === "video";
  const thumbUrl = isVideo
    ? item.posterUrl ||
      (item.variants || []).find((v) => v.label === "poster")?.url ||
      ""
    : (item.variants || []).find((v) => v.label === "thumb")?.url || item.url;

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 8 }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1/1",
          background: "#fafafa",
          borderRadius: 6,
          overflow: "hidden",
          marginBottom: 8,
        }}
      >
        {isVideo ? (
          <img
            src={thumbUrl}
            alt={item.filename}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <img
            src={thumbUrl}
            alt={item.filename}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        <input
          type="checkbox"
          checked={!!selected}
          onChange={onSelect}
          style={{ position: "absolute", top: 12, left: 12 }}
        />
      </div>

      <div
        title={item.filename}
        style={{
          fontSize: 12,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {item.filename}
      </div>
      <div className="flex justify-center items-center gap-2 flex-col  m-2 p-2 rounded-md text-wrap">
        <CopyButton text={item.filename} label="Copy name" />
        <CopyButton text={item.url} label="Copy URL" />
      </div>

      <div className="flex justify-center items-center flex-wrap m-2 gap-2 ">
        <button
          className="bg-stone-500 text-white p-2 rounded-md "
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white p-2 rounded-md "
          onClick={onDelete}
        >
          Delete
        </button>
        <a href={item.url} target="_blank" rel="noreferrer">
          <button className="bg-green-400 p-2 rounded-md ">Open</button>
        </a>
      </div>
    </div>
  );
}
