import React, { useState, useEffect } from "react";
import banner1 from "../../../public/assets/banner1.png";
import banner2 from "../../../public/assets/banner2.png";
import banner3 from "../../../public/assets/banner3.png";
import bbscart from "../../../public/assets/bbscart.png";
import healthAccess from "../../../public/assets/healthacess.png";
import { useNavigate } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";

export default function ThreeImageCarousel() {

const slides = [
{
image: banner1,
title: "Luxury Gold Jewellery",
subtitle: "Discover timeless elegance for every occasion"
},
{
image: banner2,
title: "Wedding Collection",
subtitle: "Exclusive bridal jewellery designs"
},
{
image: banner3,
title: "Silver Collection",
subtitle: "Sparkle with premium diamonds"
}
];
const navigate = useNavigate();
const [index, setIndex] = useState(0);

useEffect(() => {
const interval = setInterval(() => {
setIndex((prev) => (prev + 1) % slides.length);
}, 5000);

return () => clearInterval(interval);
}, []);

const next = () => setIndex((index + 1) % slides.length);
const prev = () => setIndex((index - 1 + slides.length) % slides.length);

return (
<>      
<div className="relative w-full h-[520px] md:h-[600px] overflow-hidden">

{slides.map((slide, i) => (
<div
key={i}
className={`absolute inset-0 transition-opacity duration-700 ${
i === index ? "opacity-100 z-10" : "opacity-0"
}`}
>

{/* Banner Image */}
<img
src={slide.image}
alt="banner"
className="w-full h-full object-cover object-[70%_center]"
/>

{/* Overlay */}
<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center justify-start">

{/* LEFT SIDE TEXT AREA */}
<div className="max-w-xl pl-16 md:pl-24">

<h1 className="text-4xl md:text-6xl font-luxury font-semibold text-[#D4AF37] mb-4 drop-shadow-lg tracking-wide">
{slide.title}
</h1>

<p className="text-gray-200 text-lg md:text-xl mb-6 font-body leading-relaxed">
{slide.subtitle}
</p>

<button
onClick={() => navigate("/all-jewellery")}
className="bg-[#D4AF37] text-black px-8 py-3 rounded-md font-semibold hover:bg-[#C8A22F] transition shadow-lg"
>
Shop Now
</button>

</div>

</div>

</div>
))}

{/* Left Arrow */}
<button
onClick={prev}
className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/60"
>
❮
</button>

{/* Right Arrow */}
<button
onClick={next}
className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/60"
>
❯
</button>

{/* Dots */}
<div className="absolute bottom-6 w-full flex justify-center gap-3">
{slides.map((_, i) => (
<div
key={i}
onClick={() => setIndex(i)}
className={`w-3 h-3 rounded-full cursor-pointer ${
i === index ? "bg-[#D4AF37]" : "bg-white/50"
}`}
></div>
))}
</div>

</div>
<div className="py-6 max-w-4xl mx-auto flex flex-col md:flex-row justify-center items-center gap-8">

  <Button
    className="px-6 py-4 text-lg rounded-lg shadow-lg border-none focus:outline-none focus:ring-0"
    style={{ background: "#D4AF37", color: "#000" }}
    onClick={() => (window.location.href = "https://bbscart.com/")}
  >
    <span className="flex items-center gap-3">
      <img
        src={bbscart}
        alt="BBSCart"
        style={{ height: "30px", objectFit: "contain" }}
      />
      BBSCart Online Shopping
    </span>
  </Button>

  <Button
    className="px-6 py-4 text-lg rounded-lg shadow-lg border-none focus:outline-none focus:ring-0"
    style={{ background: "#1C1C1C", color: "#D4AF37" }}
    onClick={() =>
      (window.location.href = "http://healthcare.bbscart.com/")
    }
  >
    <span className="flex items-center gap-3">
      <img
        src={healthAccess}
        alt="HealthAccess"
        style={{ height: "30px", objectFit: "contain" }}
      />
      BBS Global Health Access
    </span>
  </Button>

</div>
</>
);
}