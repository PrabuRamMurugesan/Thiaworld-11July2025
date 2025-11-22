// import React, { useState, useEffect, useRef } from "react";
// import {
//   FaPlay,
//   FaPause,
//   FaExpand,
//   // FaVolumeUp,
//   FaVolumeXmark,
// } from "react-icons/fa6"; // ✅ use from fa6 for modern icons
// import { FaVolumeUp } from "react-icons/fa";
// const products = [
//   // { video: "/assets/addiwali.mp4" },
//   { title: "Royal Gold Necklace", image: "/assets/Banner1.jpg" },
//   { title: "Elegant Gold Ring", image: "/assets/Banner3.jpg" },
//   { title: "Luxury Gold Bracelet", image: "/assets/Banner2.jpg" },
// ];

// function GoldAdSlider() {
//   const [current, setCurrent] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const [showEnableSound, setShowEnableSound] = useState(false);
//   const [isSoundEnabled, setIsSoundEnabled] = useState(false);

//   const videoRef = useRef(null);
//   const slide = products[current];

//   // 🟡 Try autoplay with sound first, fallback to muted
//   useEffect(() => {
//     const v = videoRef.current;
//     if (!slide?.video || !v) return;

//     const tryPlay = async () => {
//       try {
//         v.muted = false;
//         await v.play();
//         setIsSoundEnabled(true);
//         setShowEnableSound(false);
//         console.log("✅ Autoplay with sound");
//       } catch (err) {
//         console.warn("⚠️ Autoplay with sound failed:", err);
//         v.muted = true;
//         try {
//           await v.play();
//           setIsSoundEnabled(false);
//           setShowEnableSound(true);
//           console.log("🔇 Autoplay muted");
//         } catch (e) {
//           console.warn("❌ Autoplay blocked:", e);
//           setShowEnableSound(true);
//         }
//       }
//     };

//     tryPlay();

//     return () => {
//       try {
//         v.pause();
//       } catch {}
//     };
//   }, [slide]);

//   // 🔊 Enable sound manually
//   const enableSoundAndPlay = async () => {
//     const v = videoRef.current;
//     if (!v) return;

//     try {
//       v.muted = isSoundEnabled; // toggle mute
//       if (v.paused) await v.play();
//       setIsSoundEnabled(!isSoundEnabled);
//     } catch (err) {
//       console.warn("⚠️ Play with sound failed:", err);
//       setShowEnableSound(true);
//     }
//   };

//   // ⏱️ Auto-slide for images only
//   useEffect(() => {
//     const currentSlide = products[current];
//     if (paused || currentSlide.video) return;

//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % products.length);
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [current, paused]);

//   // ▶️ Auto-play when switching to a video slide
//   useEffect(() => {
//     if (videoRef.current && products[current].video) {
//       videoRef.current.play().catch(() => {});
//     }
//   }, [current]);

//   // ⏯️ Toggle Play/Pause
//   const togglePlayPause = () => {
//     const video = videoRef.current;
//     if (!video) return;

//     if (video.paused) {
//       video.play();
//       setPaused(false);
//     } else {
//       video.pause();
//       setPaused(true);
//     }
//   };

//   // ⛶ Fullscreen toggle
//   const toggleFullScreen = () => {
//     const video = videoRef.current;
//     if (!video) return;

//     if (document.fullscreenElement) {
//       document.exitFullscreen();
//     } else {
//       video.requestFullscreen();
//     }
//   };

//   // 🎬 When video ends, go to next slide
//   const handleVideoEnd = () => {
//     setCurrent((prev) => (prev + 1) % products.length);
//   };

//   return (
//     <div
//       className="relative overflow-hidden w-full h-[30vh] sm:h-[50vh] md:h-[60vh] lg:h-[600px]
//                  shadow-lg transition-all duration-500 ease-in-out"
//       onMouseEnter={() => setPaused(true)}
//       onMouseLeave={() => setPaused(false)}
//     >
//       {/* 🎥 Video or Image */}
//       {slide.video ? (
//         <video
//           ref={videoRef}
//           src={slide.video}
//           className="w-full h-full object-cover"
//           autoPlay
//           playsInline
//           onEnded={handleVideoEnd}
//         />
//       ) : (
//         <img
//           src={slide.image}
//           alt={slide.title}
//           className="w-full h-full object-cover"
//         />
//       )}

//       {/* ✨ Overlay Title + CTA */}
//       <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-10 md:px-16 bg-black/30 z-10">
//         <h2
//           className="font-bold text-2xl sm:text-3xl md:text-5xl lg:text-6xl drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]"
//           style={{ color: "gold" }}
//         >
//           {slide.title}
//         </h2>

//         {!slide.video && (
//           <a
//             href="/product-card"
//             className="mt-6 inline-block rounded-full bg-[rgb(13,88,102)] text-white font-semibold text-sm sm:text-base md:text-lg px-6 py-2 shadow-md hover:shadow-lg"
//           >
//             Shop Now
//           </a>
//         )}
//       </div>

//       {/* 🎮 Custom Video Controls */}
//       {slide.video && (
//         <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center space-x-6 z-20 bg-black/60 rounded-full px-6 py-3">
//           {/* ▶️ / ⏸ */}
//           <button
//             onClick={togglePlayPause}
//             className="text-white text-xl hover:scale-110 transition-transform"
//           >
//             {paused ? <FaPlay /> : <FaPause />}
//           </button>

//           {/* 🔊 / 🔇 */}
//           <button
//             onClick={enableSoundAndPlay}
//             className="text-white text-xl hover:scale-110 transition-transform"
//           >
//             {isSoundEnabled ? <FaVolumeUp /> : <FaVolumeXmark />}
//           </button>

//           {/* ⛶ */}
//           <button
//             onClick={toggleFullScreen}
//             className="text-white text-xl hover:scale-110 transition-transform"
//           >
//             <FaExpand />
//           </button>
//         </div>
//       )}

//       {/* 🔘 Navigation Dots */}
//       <div className="absolute bottom-4 left-1/3 -translate-x-1/2 flex space-x-3 z-20 p-3">
//         {products.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrent(index)}
//             className={`w-3 h-3 rounded-full transition-all ${
//               index === current
//                 ? "bg-yellow-400 scale-125"
//                 : "bg-slate-900 hover:bg-yellow-500"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default GoldAdSlider;
import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import bbscart from "../../../public/assets/bbscart.png";
import healthAccess from "../../../public/assets/healthacess.png";
// Single-file React component (Tailwind CSS required in your project)
// Uses the uploaded image at: /mnt/data/cfd48b56-8e7c-49c9-aa4f-39dc21430403.png

export default function ThreeImageCarousel({ images }) {
  // if user doesn't pass images, default to three copies of the uploaded file
  const defaultSrc = "/mnt/data/cfd48b56-8e7c-49c9-aa4f-39dc21430403.png";
  const imgs =
    images && images.length >= 3
      ? images
      : [
          "https://assets0.mirraw.com/images/9023035/SetMele_271_zoom.JPG?1688206870",
          "https://i.pinimg.com/originals/6b/eb/05/6beb050cf78203cdcfa8a2cd24229e04.png",
          "https://img.freepik.com/premium-photo/beautiful-girl-wearing-stylish-indian-saree-gold-jewellery_5095-3223.jpg",
        ];

  const [index, setIndex] = useState(1); // center image index (0/1/2)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % 3);
    }, 4000); // auto-rotate every 4s
    return () => clearInterval(id);
  }, []);

  const prev = () => setIndex((i) => (i + 2) % 3);
  const next = () => setIndex((i) => (i + 1) % 3);

  return (
    <>
      <div className="bg-teal-50">
        <Row>
          <Col className="d-flex justify-content-center gap-3 my-3">
            <Button
              className=" px-3"
              variant="none"
              size="sm"
              style={{ color: "black" }}
              onClick={() => (window.location.href = "https://bbscart.com/")}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <img
                  src={bbscart}
                  alt="BBSCart"
                  style={{ height: "30px", objectFit: "contain" }}
                />
                BBSCart Online Shopping
              </span>
            </Button>

            <Button
              className="px-3"
              variant="none"
              size="sm"
              style={{ color: "black" }}
              onClick={() =>
                (window.location.href = "http://healthcare.bbscart.com/")
              }
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <img
                  src={healthAccess}
                  alt="HealthAccess"
                  style={{ height: "30px", objectFit: "contain" }}
                />
                BBS Global Health Access
              </span>
            </Button>
          </Col>
        </Row>

        <div
          className="relative w-full max-w-1xl mx-auto "
          style={{
            padding: "8rem",
          }}
        >
          {/* Carousel stage */}
          <div className="relative h-52 md:h-56 lg:h-72 flex items-center justify-center overflow-visible">
            {/* Left image */}
            <div
              className={
                `absolute left-[-5rem] transform transition-all duration-700 ease-in-out pointer-events-none ` +
                (index === 0
                  ? "opacity-100 translate-x-2 scale-95 rotate-0 z-20"
                  : index === 1
                  ? "opacity-60 -translate-x-28 scale-90 -rotate-6 z-10"
                  : "opacity-60 -translate-x-28 scale-90 -rotate-6 z-10")
              }
              style={{ width: "38%", maxWidth: 420 }}
            >
              <img
                src={imgs[(index + 2) % 3]}
                alt="side left"
                className="w-full h-full object-cover rounded-xl shadow-lg border border-gray-200"
              />
            </div>

            {/* Center image */}
            <div
              className={
                `relative transform transition-all duration-700 ease-in-out z-30 ` +
                "scale-105"
              }
              style={{ width: "1400px", maxWidth: 900, height: "500px" }}
            >
              <img
                src={imgs[index]}
                alt="center"
                className="w-full h-full object-cover rounded-2xl shadow-2xl border border-gray-200"
              />
            </div>

            {/* Right image */}
            <div
              className={
                `absolute right-[-5rem]  transform transition-all duration-700 ease-in-out pointer-events-none ` +
                (index === 2
                  ? "opacity-100 -translate-x-2 scale-95 rotate-0 z-20"
                  : index === 1
                  ? "opacity-60 translate-x-28 scale-90 rotate-6 z-10"
                  : "opacity-60 translate-x-28 scale-90 rotate-6 z-10")
              }
              style={{ width: "38%", maxWidth: 420 }}
            >
              <img
                src={imgs[(index + 1) % 3]}
                alt="side right"
                className="w-full h-full object-cover rounded-xl shadow-lg border border-gray-200"
              />
            </div>
          </div>

          {/* Left/Right controls */}
          {/* <button
        onClick={prev}
        aria-label="Previous"
        className="absolute top-1/2 -left-2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg border border-gray-200 focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={next}
        aria-label="Next"
        className="absolute top-1/2 -right-2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg border border-gray-200 focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button> */}

          {/* Dots */}
          <div className="mt-4 flex items-center justify-center gap-3">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={
                  `w-3 h-3 rounded-full focus:outline-none transition-all duration-300 ` +
                  (i === index ? "scale-125 bg-gray-800" : "bg-gray-300")
                }
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mb-12 py-2 bg-pink-50">
          <h2 className="text-3xl font-bold tracking-wide text-gray-900">
            DISCOVER OUR EXQUISITE JEWELLERY COLLECTION
          </h2>

          <p className="text-lg text-gray-600 mt-2">
            These classy and elegant sparkling jewels are perfect for every
            occasion.
          </p>
        </div>
      </div>
    </>
  );
}
