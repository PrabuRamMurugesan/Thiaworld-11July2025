import React, { useRef, useState, useEffect } from "react";
import { IoMdEye } from "react-icons/io";
import { FaCamera } from "react-icons/fa";
import { FaUpload } from "react-icons/fa";
import { RiSnapchatFill } from "react-icons/ri";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { RiZoomInFill } from "react-icons/ri";
import { BiSolidZoomOut } from "react-icons/bi";
import { FaArrowsRotate } from "react-icons/fa6";
import { MdDownloading } from "react-icons/md";
import Header from "./Header";  
const jewelryOptions = [
  { name: "Earring 1", src: "/overlays/earring1.png" },
  { name: "Necklace 1", src: "/overlays/necklace1.png" },
  { name: "Ring 1", src: "/overlays/ring1.png" },
];

const VirtualJewelryOn = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [overlayIndex, setOverlayIndex] = useState(0);
  const [overlayPos, setOverlayPos] = useState({ x: 100, y: 100 });
  const [overlaySize, setOverlaySize] = useState(100);
  const [overlayRotation, setOverlayRotation] = useState(0);
  const [snapshotUrl, setSnapshotUrl] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
      setCameraActive(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch (err) {
      alert("Camera access denied or not available.");
    }
  };

  const handleMouseDrag = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - overlaySize / 2;
    const y = e.clientY - rect.top - overlaySize / 2;
    setOverlayPos({ x, y });
  };

  const handleTouchDrag = (e) => {
    const touch = e.touches[0];
    handleMouseDrag({
      clientX: touch.clientX,
      clientY: touch.clientY,
      currentTarget: e.currentTarget,
    });
  };

  const switchJewelry = (direction) => {
    const newIndex =
      (overlayIndex + direction + jewelryOptions.length) %
      jewelryOptions.length;
    setOverlayIndex(newIndex);
  };

  const takeSnapshot = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const container = containerRef.current;

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    if (cameraActive && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    } else if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawOverlay(ctx);
      };
      return;
    }

    // For live video
    if (cameraActive) {
      drawOverlay(ctx);
    }
  };

  const drawOverlay = (ctx) => {
    const overlayImg = new Image();
    overlayImg.src = jewelryOptions[overlayIndex].src;
    overlayImg.onload = () => {
      ctx.save();
      ctx.translate(
        overlayPos.x + overlaySize / 2,
        overlayPos.y + overlaySize / 2
      );
      ctx.rotate((overlayRotation * Math.PI) / 180);
      ctx.drawImage(
        overlayImg,
        -overlaySize / 2,
        -overlaySize / 2,
        overlaySize,
        overlaySize
      );
      ctx.restore();
      setSnapshotUrl(canvasRef.current.toDataURL("image/png"));
    };
  };

  return (
    <>
    <Header/>
      <div className="flex flex-col md:flex-row items-center justify-center  ">
        <div className="   bg-gray-300 flex flex-col items-center justify-start border-2 m-8 p-3 py-4 pb-5 border-gray-400 rounded-3xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
            <IoMdEye className=" items-end" /> Try Jewelry On
          </h2>

          <div className="flex flex-wrap gap-4 mb-4">
            <button
              onClick={startCamera}
              className="  px-4 py-2  rounded hover:bg-blue-700 flex items-center gap-2
"
            >
              <FaCamera /> Use Camera
            </button>

            <label
              className="cursor-pointer px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2
"
            >
              <FaUpload /> Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={takeSnapshot}
              className=" px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2
"
            >
              <RiSnapchatFill />
              Take Snapshot
            </button>
          </div>

          {/* Preview area */}
          <div
            ref={containerRef}
            className="relative w-full max-w-md h-[500px] bg-gray-100 border border-gray-300 rounded-md overflow-hidden shadow mb-4"
            onMouseDown={handleMouseDrag}
            onTouchStart={handleTouchDrag}
          >
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                className="w-full h-400 object-cover"
              />
            ) : imageSrc ? (
              <img
                src={imageSrc}
                alt="preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 ">
                No preview yet
              </div>
            )}

            {/* Overlay jewelry */}
            <img
              src={jewelryOptions[overlayIndex].src}
              alt="jewelry"
              className="absolute object-contain cursor-move"
              style={{
                top: overlayPos.y,
                left: overlayPos.x,
                width: `${overlaySize}px`,
                height: `${overlaySize}px`,
                transform: `rotate(${overlayRotation}deg)`,
              }}
            />
          </div>

          {/* Overlay controls */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button
              onClick={() => switchJewelry(-1)}
              className="px-3 py-1rounded hover:bg-gray-300 flex items-center gap-2
"
            >
              <FaArrowAltCircleLeft /> Prev
            </button>
            <span className="font-medium">
              {jewelryOptions[overlayIndex].name}
            </span>
            <button
              onClick={() => switchJewelry(1)}
              className="px-3 py-1 rounded hover:bg-gray-300  flex items-center gap-2
"
            >
              Next <FaArrowAltCircleRight />
            </button>

            <button
              onClick={() => setOverlaySize((prev) => prev + 10)}
              className="bg-yellow-400 px-2 py-1 rounded flex items-center gap-2
"
            >
              <RiZoomInFill /> Zoom
            </button>
            <button
              onClick={() => setOverlaySize((prev) => Math.max(prev - 10, 50))}
              className="bg-yellow-400 px-2 py-1 rounded flex items-center gap-2
"
            >
              <BiSolidZoomOut /> Zoom
            </button>
            <button
              onClick={() => setOverlayRotation((prev) => prev + 10)}
              className="00 px-2 py-1 rounded flex items-center gap-2
"
            >
              <FaArrowsRotate /> Rotate
            </button>
          </div>

          {/* Snapshot Result */}
          {snapshotUrl && (
            <div className="w-full max-w-md text-center">
              <h3 className="font-semibold mb-2">📸 Your Snapshot</h3>
              <img
                src={snapshotUrl}
                alt="snapshot"
                className="w-full border rounded shadow"
              />
              <a
                href={snapshotUrl}
                download="my-jewelry-look.png"
                className="inline-block mt-3 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                <MdDownloading /> Download Image
              </a>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </>
  );
};

export default VirtualJewelryOn;
