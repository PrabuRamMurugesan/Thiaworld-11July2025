import React, { useState, useEffect, useRef } from "react";
import {
  FaPlay,
  FaPause,
  FaExpand,
  // FaVolumeUp,
  FaVolumeXmark,
} from "react-icons/fa6"; // ✅ use from fa6 for modern icons
import { FaVolumeUp } from "react-icons/fa";
const products = [
  // { video: "/assets/addiwali.mp4" },
  { title: "Royal Gold Necklace", image: "/assets/Banner1.jpg" },
  { title: "Elegant Gold Ring", image: "/assets/Banner3.jpg" },
  { title: "Luxury Gold Bracelet", image: "/assets/Banner2.jpg" },
];

function GoldAdSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showEnableSound, setShowEnableSound] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  const videoRef = useRef(null);
  const slide = products[current];

  // 🟡 Try autoplay with sound first, fallback to muted
  useEffect(() => {
    const v = videoRef.current;
    if (!slide?.video || !v) return;

    const tryPlay = async () => {
      try {
        v.muted = false;
        await v.play();
        setIsSoundEnabled(true);
        setShowEnableSound(false);
        console.log("✅ Autoplay with sound");
      } catch (err) {
        console.warn("⚠️ Autoplay with sound failed:", err);
        v.muted = true;
        try {
          await v.play();
          setIsSoundEnabled(false);
          setShowEnableSound(true);
          console.log("🔇 Autoplay muted");
        } catch (e) {
          console.warn("❌ Autoplay blocked:", e);
          setShowEnableSound(true);
        }
      }
    };

    tryPlay();

    return () => {
      try {
        v.pause();
      } catch {}
    };
  }, [slide]);

  // 🔊 Enable sound manually
  const enableSoundAndPlay = async () => {
    const v = videoRef.current;
    if (!v) return;

    try {
      v.muted = isSoundEnabled; // toggle mute
      if (v.paused) await v.play();
      setIsSoundEnabled(!isSoundEnabled);
    } catch (err) {
      console.warn("⚠️ Play with sound failed:", err);
      setShowEnableSound(true);
    }
  };

  // ⏱️ Auto-slide for images only
  useEffect(() => {
    const currentSlide = products[current];
    if (paused || currentSlide.video) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [current, paused]);

  // ▶️ Auto-play when switching to a video slide
  useEffect(() => {
    if (videoRef.current && products[current].video) {
      videoRef.current.play().catch(() => {});
    }
  }, [current]);

  // ⏯️ Toggle Play/Pause
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  };

  // ⛶ Fullscreen toggle
  const toggleFullScreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  // 🎬 When video ends, go to next slide
  const handleVideoEnd = () => {
    setCurrent((prev) => (prev + 1) % products.length);
  };

  return (
    <div
      className="relative overflow-hidden w-full h-[30vh] sm:h-[50vh] md:h-[60vh] lg:h-[600px]
                 shadow-lg transition-all duration-500 ease-in-out"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 🎥 Video or Image */}
      {slide.video ? (
        <video
          ref={videoRef}
          src={slide.video}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          onEnded={handleVideoEnd}
        />
      ) : (
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover"
        />
      )}

      {/* ✨ Overlay Title + CTA */}
      <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-10 md:px-16 bg-black/30 z-10">
        <h2
          className="font-bold text-2xl sm:text-3xl md:text-5xl lg:text-6xl drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]"
          style={{ color: "gold" }}
        >
          {slide.title}
        </h2>

        {!slide.video && (
          <a
            href="/product-card"
            className="mt-6 inline-block rounded-full bg-[rgb(13,88,102)] text-white font-semibold text-sm sm:text-base md:text-lg px-6 py-2 shadow-md hover:shadow-lg"
          >
            Shop Now
          </a>
        )}
      </div>

      {/* 🎮 Custom Video Controls */}
      {slide.video && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center space-x-6 z-20 bg-black/60 rounded-full px-6 py-3">
          {/* ▶️ / ⏸ */}
          <button
            onClick={togglePlayPause}
            className="text-white text-xl hover:scale-110 transition-transform"
          >
            {paused ? <FaPlay /> : <FaPause />}
          </button>

          {/* 🔊 / 🔇 */}
          <button
            onClick={enableSoundAndPlay}
            className="text-white text-xl hover:scale-110 transition-transform"
          >
            {isSoundEnabled ? <FaVolumeUp /> : <FaVolumeXmark />}
          </button>

          {/* ⛶ */}
          <button
            onClick={toggleFullScreen}
            className="text-white text-xl hover:scale-110 transition-transform"
          >
            <FaExpand />
          </button>
        </div>
      )}

      {/* 🔘 Navigation Dots */}
      <div className="absolute bottom-4 left-1/3 -translate-x-1/2 flex space-x-3 z-20 p-3">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === current
                ? "bg-yellow-400 scale-125"
                : "bg-slate-900 hover:bg-yellow-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default GoldAdSlider;
