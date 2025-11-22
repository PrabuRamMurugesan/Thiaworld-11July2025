import React, { useState, useEffect } from "react";
const TestimonialsSection = () => {

  // 3-Image Auto-Rotate Carousel Images
  const imgs = [
    "https://img.freepik.com/premium-photo/allure-thick-traditional-gold-jewellery_670382-94026.jpg",
    "https://img.freepik.com/premium-photo/nice-woman-wearing-elegant-jewellery_85869-1043.jpg",
    "https://img.freepik.com/premium-photo/beautiful-girl-wearing-stylish-indian-saree-gold-jewellery_5095-3223.jpg"
  ];
  const [index, setIndex] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % 3);
    }, 4000);

    return () => clearInterval(id);
  }, []);
  const topImages = [
    "https://i.etsystatic.com/26766328/r/il/2c5c4c/4702110678/il_1080xN.4702110678_git3.jpg",
    "https://tse1.explicit.bing.net/th/id/OIP.nMI5KpFuEPKbAKTtvcHARQHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3",
    "https://img.freepik.com/premium-photo/allure-thick-traditional-gold-jewellery_670382-94028.jpg",
    "https://alfajewellers.com/wp-content/uploads/sites/2/2024/03/How-to-Safely-Travel-with-Gold-Jewellery-in-India.webp",
    "https://as1.ftcdn.net/v2/jpg/04/01/33/16/1000_F_401331663_bznlwK3J9lozSWTM4fro071NWMAGpE9H.jpg",
  ];

  return (
    <div className="w-full bg-[#e6f7f4] py-12 px-6">

      {/* Heading */}
      <h2 className="text-center text-2xl font-bold text-gray-900">
        Customer Testimonials
      </h2>
      <p className="text-center text-gray-700 mt-2">
        Hear what our happy customers say about Thiaworld and Golldex Secure Plan
      </p>

      {/* Top Images */}
      <div className="flex justify-center gap-5 mt-10 flex-wrap">
        {topImages.map((src, i) => (
          <img
            key={i}
            src={src}
            className="w-48 h-48 object-cover rounded-lg shadow-md"
            alt="Customer"
          />
        ))}
      </div>

      {/* Section Title */}
      <h2 className="text-center text-2xl font-bold text-gray-900 mt-12">
        Watch Their Stories
      </h2>

      {/* --- 3D Rotating Carousel --- */}
      <div className="relative w-full max-w-7xl mx-auto py-2">

        <div className="relative h-[500px] flex items-center justify-center overflow-visible">

          {/* LEFT IMAGE */}
          <div
            className={`absolute left-[5rem] transition-all duration-700 ease-in-out pointer-events-none
            ${index === 1 ? "opacity-60 -translate-x-28 scale-90 -rotate-6" :
              index === 2 ? "opacity-60 -translate-x-28 scale-90 -rotate-6" :
              "opacity-100 translate-x-2 scale-95 rotate-0"}
            `}
            style={{ width: "30%", maxWidth: 420 }}
          >
            <img
              src={imgs[(index + 2) % 3]}
              alt="side left"
              className="w-full h-full object-cover rounded-xl shadow-lg border border-gray-200"
            />
          </div>

          {/* CENTER IMAGE */}
          <div
            className="relative z-30 transition-all duration-700 scale-105"
            style={{ width: "600px", height: "400px" }}
          >
            <img
              src={imgs[index]}
              alt="center"
              className="w-full h-full object-cover rounded-2xl shadow-2xl border border-gray-200"
            />
          </div>

          {/* RIGHT IMAGE */}
          <div
            className={`absolute right-[5rem] transition-all duration-700 ease-in-out pointer-events-none
            ${index === 1 ? "opacity-60 translate-x-28 scale-90 rotate-1" :
              index === 0 ? "opacity-60 translate-x-28 scale-90 rotate-6" :
              "opacity-100 -translate-x-2 scale-95 rotate-0"}
            `}
            style={{ width: "28%", maxWidth: 420 }}
          >
            <img
              src={imgs[(index + 1) % 3]}
              alt="side right"
              className="w-full h-full object-cover rounded-xl shadow-lg border border-gray-200"
            />
          </div>

        </div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-3">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === i ? "bg-gray-800 scale-125" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

      </div>

    </div>
  );
};

export default TestimonialsSection;
