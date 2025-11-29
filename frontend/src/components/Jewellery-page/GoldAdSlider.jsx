
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
      <div className=" border-t border-b py-6 max-w-5xl mx-auto">
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
          className="relative w-full max-w-5xl mx-auto overflow-hidden"
          style={{
            padding: "2rem",
          }}
        >
          <div className="relative h-52 md:h-56 lg:h-72 flex items-center justify-center overflow-visible">
            {/* Left image */}
            <div
              className={`absolute left-[-3rem] transform transition-all duration-700 ease-in-out pointer-events-none ${
                index === 0
                  ? "opacity-100 translate-x-2 scale-95 rotate-0 z-20"
                  : "opacity-60 -translate-x-20 scale-90 -rotate-6 z-10"
              }`}
              style={{ width: "38%", maxWidth: 420 }}
            >
              <img
                src={imgs[(index + 2) % 3]}
                alt="left"
                className="w-full h-full object-cover rounded-xl shadow-lg border border-gray-200"
              />
            </div>

            {/* Center image */}
            <div
              className="relative transform transition-all duration-700 ease-in-out z-30 scale-105"
              style={{ width: "100%", maxWidth: "750px", height: "500px" }} // FIXED WIDTH HERE ONLY
            >
              <img
                src={imgs[index]}
                alt="center"
                className="w-full h-full object-cover rounded-2xl shadow-2xl border border-gray-200"
              />
            </div>

            {/* Right image */}
            <div
              className={`absolute right-[-3rem] transform transition-all duration-700 ease-in-out pointer-events-none ${
                index === 2
                  ? "opacity-100 -translate-x-2 scale-95 rotate-0 z-20"
                  : "opacity-60 translate-x-20 scale-90 rotate-6 z-10"
              }`}
              style={{ width: "38%", maxWidth: 420 }}
            >
              <img
                src={imgs[(index + 1) % 3]}
                alt="right"
                className="w-full h-full object-cover rounded-xl shadow-lg border border-gray-200"
              />
            </div>
          </div>

          {/* Dots */}
          <div className="mt-4 flex items-center justify-center gap-3">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === index ? "scale-125 bg-gray-800" : "bg-gray-300"
                }`}
              ></button>
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
