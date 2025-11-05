import React, { useState } from "react";
import ModalImage from "react-modal-image";
import { FaHeart, FaShoppingCart, FaBolt, FaShareAlt ,FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductDetail from "./ProductDetail";
import { pickFirstImageSrc } from "../utils/imageTools"; // adjust path if this file sits deeper

const ProductCard = () => {
  const [paymentOption, setPaymentOption] = useState("full");

  const product = {
    title: "22K Temple Gold Necklace",
    code: "GRT-22KGOLD123",
    price: 96700,
    originalPrice: 102000,
    discount: "5% OFF",
    description: "Intricately carved with Lakshmi motifs and antique finish.",
    metal: "Gold",
    purity: "22K",
    weight: {
      net: "72.8",
      gross: "74.2",
    },
    isNewArrival: true,
    quickDelivery: true,
    images: [
      "/products/Gold-Ring.jpg",
      "/products/R.jpeg",
      "/overlays/earring.png",
    ],
  };


  const [currentIndex, setCurrentIndex] = useState(0);
  const images = product.images;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <>
   <div className=" flex-col md:flex-row md:justify-between items-center gap-4  bg-slate-200 h-fit p-5">
   <div className="flex flex-row justify-between items-center p-2   bg-slate-200">
        <h2 className="text-xl font-bold">Product Card</h2>
        <ProductDetail />
      </div>

      <div className=" p-8 pb-5 rounded-lg shadow-md max-w-6xl mx-auto mt-6 bg-white m-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-5">
          {/* Product Images */}
          {/* <div className="space-y-4">
            <ModalImage
              small={product.images[0]} 
              large={product.images[0]}
              alt={product.title}
              className="rounded-md"
            />
            <div className="flex gap-2">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumb ${index}`}
                  className="w-16 h-16 object-cover border rounded-md cursor-pointer"
                />
              ))}
            </div>
          </div> */}

<div className="space-y-4 relative">
      {/* Arrows */}
      <div className="relative">
        <ModalImage
          small={images[currentIndex]}
          large={images[currentIndex]}
          alt={product.title}
          className="rounded-md w-full object-cover"
        />
        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black-100  text-white p-2  h-60 w-20"
        >
        </button>
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black-100  text-white p-2   h-60 w-20" 
        >
         
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 justify-center mt-2">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumb ${index}`}
            className={`w-16 h-16 object-cover border rounded-md cursor-pointer ${
              index === currentIndex ? "border-yellow-500" : ""
            }`}
            onClick={() => handleThumbnailClick(index)}
          />
        ))}
      </div>
    </div>

          {/* Product Info */}
          <div>
            <h2 className="text-xl font-bold mb-1">{product.title}</h2>
            <p className="text-gray-500 text-sm mb-1">
              Product Code: {product.code}
            </p>

            <div className="text-yellow-600 text-2xl font-semibold mt-2">
              ₹{product.price.toLocaleString()}
            </div>
            <div className="text-gray-400 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </div>
            <div className="text-green-600 font-semibold">
              {product.discount}
            </div>

            <p className="text-sm mt-2">{product.description}</p>
            <p className="text-sm mt-1">
              <strong>Metal:</strong> {product.metal} | <strong>Purity:</strong>{" "}
              {product.purity}
            </p>
            <p className="text-sm">
              <strong>Weight:</strong> Net {product.weight.net} g / Gross{" "}
              {product.weight.gross} g
            </p>

            {/* Payment Options */}
            <div className="flex items-center gap-4 mt-3">
              <label>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentOption === "full"}
                  onChange={() => setPaymentOption("full")}
                />
                Full Payment
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentOption === "partial"}
                  onChange={() => setPaymentOption("partial")}
                />
                Partial Payment (40%)
              </label>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mt-4">
              <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center gap-2">
                <FaShoppingCart /> Add to Cart
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2">
                <FaBolt /> Buy Now
              </button>
              <button className="border px-4 py-2 rounded hover:border-yellow-600 flex items-center gap-2">
                <FaHeart /> Wishlist
              </button>
            </div>

            {/* Extra Buttons */}
            <div className="flex flex-wrap gap-3 mt-4 text-sm">
              <button className="underline text-blue-600">
                Notify Price Drop
              </button>
              <button className="underline text-blue-600">View Similar</button>
              <button className="underline text-blue-600">
                View Collection
              </button>
              <button className="underline text-blue-600 flex items-center gap-1">
                <FaShareAlt /> Share
              </button>
            </div>

            {/* Delivery & WhatsApp */}
            <div className="flex gap-3 items-center mt-5">
              <input
                type="text"
                placeholder="Enter Pincode"
                className="border px-3 py-1 rounded"
              />
              <button className="bg-green-500 text-white px-4 py-1 rounded">
                Check Delivery
              </button>
              <button className="bg-green-700 text-white px-4 py-1 rounded">
                WhatsApp Us
              </button>
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold">Product Description</h3>
          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
        </div>

        {/* Product Info Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Product Information</h3>
          <ul className="text-sm text-gray-600 list-disc list-inside mt-1">
            <li>Metal: {product.metal}</li>
            <li>Purity: {product.purity}</li>
            <li>Net Weight: {product.weight.net} g</li>
            <li>Gross Weight: {product.weight.gross} g</li>
          </ul>
        </div>
      </div>
   </div>
    </>
  );
};

export default ProductCard;

// import React, { useState } from "react";
// import { FaHeart, FaShareAlt } from "react-icons/fa";
// import { FiTruck, FiTag } from "react-icons/fi";
// import { MdOutlinePriceChange } from "react-icons/md";
// import ProductDetail from "./ProductDetail";

// const ProductCard = ({ product }) => {
//   const [selectedPayment, setSelectedPayment] = useState("full");

//   if (!product) {
//     return <div className="text-red-600 text-center">Invalid product data</div>;
//   }

//   const {
//     image,
//     title,
//     code,
//     price,
//     originalPrice,
//     description,
//     metal,
//     purity,
//     netWeight,
//     grossWeight,
//     combo,
//     stoneDetails,
//   } = product;

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <div className="flex flex-row justify-between items-center mb-4">
//      <h2 className="text-xl font-bold">Test Product Card</h2>
//      <ProductDetail />
//    </div>
//       <h1 className="text-2xl font-bold mb-6">Test Product Card</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//         {/* Product Image */}
//         <div className="relative">
//           <img
//             src={image}
//             alt={title}
//             className="w-full h-auto object-contain rounded-lg shadow-md"
//           />
//           <div className="absolute top-2 left-2 bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
//             <FiTruck className="inline-block mr-1" />
//             Quick Delivery
//           </div>
//           <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm">
//             <FiTag className="inline-block mr-1" />
//             New Arrival
//           </div>
//         </div>

//         {/* Product Details */}
//         <div>
//           <h2 className="text-xl font-bold">{title}</h2>
//           <p className="text-sm text-gray-500">Product Code: {code}</p>

//           <div className="mt-3">
//             <span className="text-xl font-semibold text-yellow-600">₹{price}</span>
//             <span className="line-through ml-2 text-gray-500">₹{originalPrice}</span>
//             <p className="text-green-600 text-sm mt-1">% OFF</p>
//           </div>

//           <p className="text-gray-700 mt-2">{description}</p>

//           <div className="mt-3 text-sm text-gray-700">
//             <p><strong>Metal:</strong> {metal} | <strong>Purity:</strong> {purity}</p>
//             <p><strong>Weight:</strong> {netWeight}g / {grossWeight}g</p>
//             {combo && <p className="text-indigo-500 font-semibold">🔥 Combo Set Available</p>}
//           </div>

//           {/* Payment Options */}
//           <div className="mt-4">
//             <label className="mr-4">
//               <input
//                 type="radio"
//                 name="payment"
//                 value="full"
//                 checked={selectedPayment === "full"}
//                 onChange={() => setSelectedPayment("full")}
//                 className="mr-1"
//               />
//               Full Payment
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="payment"
//                 value="partial"
//                 checked={selectedPayment === "partial"}
//                 onChange={() => setSelectedPayment("partial")}
//                 className="mr-1"
//               />
//               Partial Payment (40%)
//             </label>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-wrap gap-3 mt-4">
//             <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md">Add to Cart</button>
//             <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">Buy Now</button>
//             <button className="flex items-center gap-1 px-4 py-2 border rounded-md"><FaHeart /> Wishlist</button>
//             <button className="flex items-center gap-1 px-4 py-2 border rounded-md"><FaShareAlt /> Share</button>
//             <button className="flex items-center gap-1 px-4 py-2 border rounded-md">View Similar</button>
//             <button className="flex items-center gap-1 px-4 py-2 border rounded-md">View Collection</button>
//           </div>

//           {/* Delivery + Price Drop */}
//           <div className="mt-4 flex flex-wrap gap-3 items-center">
//             <button className="flex items-center gap-1 text-blue-600 underline">
//               <MdOutlinePriceChange /> Notify Price Drop
//             </button>
//             <div className="flex gap-2 items-center">
//               <input
//                 type="text"
//                 placeholder="Enter Pincode"
//                 className="border px-3 py-1 rounded-md"
//               />
//               <button className="bg-gray-700 text-white px-3 py-1 rounded-md">Check</button>
//             </div>
//             <button className="bg-green-200 text-green-800 px-3 py-1 rounded-md">📱 WhatsApp Chat</button>
//           </div>

//           {/* Product Description */}
//           <div className="mt-6 bg-yellow-50 p-4 rounded-md">
//             <h3 className="font-semibold mb-2">Product Description</h3>
//             <p>{description}</p>
//           </div>

//           {/* Product Info */}
//           <div className="mt-6">
//             <h3 className="font-semibold mb-2">Product Information</h3>
//             <p><strong>Metal and Purity:</strong> {metal} {purity}</p>
//             <p><strong>Weight:</strong> {netWeight} g</p>
//           </div>

//           {/* Stone Details */}
//           {stoneDetails && stoneDetails.length > 0 && (
//             <div className="mt-6">
//               <h3 className="font-semibold mb-2">Diamond and Stone Details</h3>
//               <table className="w-full table-auto border border-gray-300">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="border px-3 py-1">Stone</th>
//                     <th className="border px-3 py-1">Weight</th>
//                     <th className="border px-3 py-1">Rate</th>
//                     <th className="border px-3 py-1">Value</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {stoneDetails.map((stone, index) => (
//                     <tr key={index}>
//                       <td className="border px-3 py-1">{stone.name}</td>
//                       <td className="border px-3 py-1">{stone.weight}</td>
//                       <td className="border px-3 py-1">₹{stone.rate}</td>
//                       <td className="border px-3 py-1">₹{stone.value}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;

// import React, { useState } from "react";
// import {
//   FaHeart,
//   FaShareAlt,
//   FaSearchPlus,
//   FaShoppingCart,
//   FaBolt,
// } from "react-icons/fa";
// import TryJewelOn from "./VirtualJewelryOn"; // Assuming this is implemented
// // import sampleImages from '../data/sampleImages'; // Add your image paths here
// import PriceBreakdown from "./PriceBreakdown";
// import MoreFromCollection from "./MoreFromCollection";
// import SimilarDesigns from "./SimilarDesigns";
// import PopularSearches from "./PopularSearches";
// import MaintenanceGuide from "./MaintenanceGuide";
// import ProductDetail from "./ProductDetail";
// const ProductCard = ({ product }) => {
//   if (!product) {
//     return (
//       <div className="text-center py-10 text-red-600 font-semibold">
//         Invalid product data
//       </div>
//     );
//   }

//   const [selectedImage, setSelectedImage] = useState(product.images?.[0]);
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [isPartial, setIsPartial] = useState(false);

//   const handleImageChange = (img) => setSelectedImage(img);
//   const toggleWishlist = () => setIsWishlisted(!isWishlisted);

//   const priceToShow = isPartial ? product.partialPrice : product.fullPrice;

//   return (
//     <>
//      <div className="p-6 bg-gray-50 min-h-screen">
//   <div className="flex flex-row justify-between items-center mb-4">
//     <h2 className="text-xl font-bold">Test Product Card</h2>
//     <ProductDetail />
//   </div>
//         <div className="max-w-7xl mx-auto p-4 md:p-10">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//             {/* Image & Gallery */}
//             <div>
//               <div className="border rounded-lg overflow-hidden shadow-md relative">
//                 <img
//                   src={selectedImage}
//                   alt={product.name}
//                   className="w-full h-[400px] object-contain hover:scale-105 transition-transform duration-300"
//                 />
//                 <div className="absolute top-3 right-3">
//                   <FaSearchPlus className="text-white bg-black bg-opacity-40 p-2 rounded-full text-2xl cursor-pointer" />
//                 </div>
//               </div>
//               <div className="flex gap-2 mt-4 overflow-x-auto">
//                 {product.images?.map((img, idx) => (
//                   <img
//                     key={idx}
//                     src={img}
//                     alt={`Thumb ${idx}`}
//                     className={`w-20 h-20 object-cover cursor-pointer border-2 ${
//                       selectedImage === img
//                         ? "border-yellow-500"
//                         : "border-transparent"
//                     }`}
//                     onClick={() => handleImageChange(img)}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* Product Info */}
//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold">{product.name}</h2>
//               <p className="text-sm text-gray-500">
//                 Product Code: {product.code}
//               </p>
//               <div className="text-xl font-semibold text-yellow-600">
//                 ₹{priceToShow.toLocaleString()}
//               </div>
//               <p className="text-sm line-through text-gray-400">
//                 ₹{product.originalPrice}
//               </p>
//               <p className="text-green-600 text-sm">{product.discount}% OFF</p>

//               <p className="text-sm mt-2">{product.description}</p>

//               <div className="text-sm text-gray-700">
//                 <strong>Metal:</strong> {product.metal} |{" "}
//                 <strong>Purity:</strong> {product.purity}
//                 <br />
//                 <strong>Weight:</strong> Net {product.weightNet}g / Gross{" "}
//                 {product.weightGross}g
//               </div>

//               {/* Payment Toggle */}
//               <div className="flex items-center gap-4">
//                 <label className="flex items-center gap-1">
//                   <input
//                     type="radio"
//                     name="payment"
//                     checked={!isPartial}
//                     onChange={() => setIsPartial(false)}
//                   />
//                   Full Payment
//                 </label>
//                 <label className="flex items-center gap-1">
//                   <input
//                     type="radio"
//                     name="payment"
//                     checked={isPartial}
//                     onChange={() => setIsPartial(true)}
//                   />
//                   Partial Payment (40%)
//                 </label>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex gap-3 mt-4">
//                 <button className="bg-yellow-500 text-white px-4 py-2 rounded shadow">
//                   <FaShoppingCart className="inline-block mr-2" /> Add to Cart
//                 </button>
//                 <button className="bg-green-600 text-white px-4 py-2 rounded shadow">
//                   <FaBolt className="inline-block mr-2" /> Buy Now
//                 </button>
//                 <button
//                   onClick={toggleWishlist}
//                   className={`px-4 py-2 rounded shadow ${
//                     isWishlisted ? "bg-red-500 text-white" : "bg-white border"
//                   }`}
//                 >
//                   <FaHeart className="inline-block mr-2" /> Wishlist
//                 </button>
//               </div>

//               <PriceBreakdown priceDetails={product.priceBreakdown} />
//               <MoreFromCollection items={product.moreCollection || []} />
//               <SimilarDesigns items={product.similarDesigns || []} />
//               <PopularSearches />
//               <MaintenanceGuide />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ProductCard;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaHeart, FaRegHeart, FaWhatsapp } from 'react-icons/fa';

// const ProductCard = ({ product, isWishlisted, toggleWishlist }) => {
//     // ✅ Defensive Check
//   if (!product || typeof product !== 'object') {
//     return <div className="p-4 text-red-500 text-sm">Invalid product data.</div>;
//   }

//   const [paymentType, setPaymentType] = useState("full");
//   const fullPrice = product?.fullPrice ?? product?.discountedPrice ?? 0;
//   const partialPercent = product.partialPercent || 40;
//   const partialAmount = Math.round((partialPercent / 100) * fullPrice);

//   // ✅ Rest of your code continues below...

//     const navigate = useNavigate();

//   return (
//     <div className="border rounded shadow p-3 bg-white hover:shadow-md transition relative group">
//       {/* Wishlist Icon */}
//       <div
//         className="absolute top-3 right-3 text-pink-600 hover:text-pink-700 cursor-pointer z-10"
//         onClick={() => toggleWishlist(product.id)}
//         title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
//       >
//         {isWishlisted ? <FaHeart className="text-lg" /> : <FaRegHeart className="text-lg" />}
//       </div>

//       {/* Image */}
//       <div
//         className="w-full h-48 bg-gray-100 rounded overflow-hidden flex items-center justify-center cursor-pointer"
//         onClick={() => navigate(`/product/${product.id}`)}
//       >
//         <img
//           src={product.image}
//           alt={product.name}
//           className="object-cover h-full w-full transition-transform duration-200 group-hover:scale-105"
//         />
//       </div>

//       {/* Badges */}
//       <div className="mt-2 flex flex-wrap gap-1 text-xs font-medium">
//         {product.badges?.map((badge, index) => (
//           <span
//             key={index}
//             className={`px-2 py-0.5 rounded-full ${
//               badge === 'BIS' ? 'bg-yellow-100 text-yellow-800' :
//               badge === 'Trending' ? 'bg-pink-100 text-pink-600' :
//               badge === 'Bestseller' ? 'bg-blue-100 text-blue-600' :
//               badge === 'Limited' ? 'bg-red-100 text-red-600' :
//               badge === 'Fast Delivery' ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-600'
//             }`}
//           >
//             {badge}
//           </span>
//         ))}
//         {product.combo && (
//           <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">Combo Available</span>
//         )}
//         {product.securePlan && (
//           <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Secure Plan</span>
//         )}
//       </div>

//       {/* Title & Desc */}
//       <div className="mt-2">
//         <h3
//           onClick={() => navigate(`/product/${product.id}`)}
//           className="text-sm font-semibold text-gray-800 hover:text-yellow-600 cursor-pointer"
//         >
//           {product.name}
//         </h3>
//         <p className="text-xs text-gray-500">{product.category}</p>
//         <p className="text-xs text-gray-600">{product.description}</p>
//       </div>

//       {/* Weight & Metal Info */}
//       <div className="text-xs text-gray-600 mt-1">
//         <p>Net: {product.netWeight}g | Gross: {product.grossWeight}g</p>
//         <p>Metal: {product.metalType} | Color: {product.metalColor}</p>
//       </div>

//       {/* Price Block */}
//       <div className="mt-2 text-yellow-700 font-semibold text-md">
//         ₹{fullPrice.toLocaleString()}
//         {product.originalPrice && (
//           <span className="text-gray-400 line-through text-sm ml-2">
//             ₹{product.originalPrice.toLocaleString()}
//           </span>
//         )}
//       </div>

//       {/* Payment Toggle */}
//       {product.securePlan && (
//         <div className="mt-2 text-xs text-gray-700">
//           <div className="flex gap-2 items-center">
//             <label className="flex items-center gap-1">
//               <input
//                 type="radio"
//                 value="full"
//                 checked={paymentType === "full"}
//                 onChange={() => setPaymentType("full")}
//               />
//               Full Payment
//             </label>
//             <label className="flex items-center gap-1">
//               <input
//                 type="radio"
//                 value="partial"
//                 checked={paymentType === "partial"}
//                 onChange={() => setPaymentType("partial")}
//               />
//               Secure Plan (Pay ₹{partialAmount.toLocaleString()})
//             </label>
//           </div>
//         </div>
//       )}

//       {/* Availability */}
//       <div className="mt-1 text-xs text-gray-600">
//         {product.inStock ? (
//           <span className="text-green-600">✔ In Stock</span>
//         ) : (
//           <span className="text-red-500">Out of Stock</span>
//         )}
//       </div>

//       {/* Actions */}
//       <div className="mt-3 flex flex-col sm:flex-row gap-2">
//         <button
//           onClick={() => navigate("/virtual-try-on")}
//           className="flex-1 text-xs text-pink-600 border border-pink-600 rounded px-2 py-1 hover:bg-pink-50"
//         >
//           👁 Try This On
//         </button>
//         <button className="flex-1 text-xs bg-yellow-500 text-white rounded px-2 py-1 hover:bg-yellow-600">
//           🛒 Add to Cart
//         </button>
//         <button className="flex-1 text-xs bg-green-600 text-white rounded px-2 py-1 hover:bg-green-700">
//           ⚡ Buy Now
//         </button>
//       </div>

//       {/* Share */}
//       <a
//         href={`https://wa.me/?text=Check%20this%20jewel:%20https://bbscart.com/product/${product.id}`}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="absolute bottom-3 right-3 text-green-600 hover:text-green-700 text-lg"
//         title="Share on WhatsApp"
//       >
//         <FaWhatsapp />
//       </a>
//     </div>
//   );
// };

// export default ProductCard;
// // // src/components/ProductCard.jsx

// // import React from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { FaHeart, FaRegHeart, FaWhatsapp } from 'react-icons/fa';

// // const ProductCard = ({ product, isWishlisted, toggleWishlist }) => {
// //   const navigate = useNavigate();

// //   return (
// //     <div className="border rounded shadow-sm p-3 bg-white hover:shadow-md transition duration-300 relative group">
// //       {/* Wishlist Icon */}
// //       <div
// //         className="absolute top-3 right-3 text-pink-600 hover:text-pink-700 cursor-pointer z-10"
// //         onClick={() => toggleWishlist(product.id)}
// //         title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
// //       >
// //         {isWishlisted ? <FaHeart className="text-lg" /> : <FaRegHeart className="text-lg" />}
// //       </div>

// //       {/* Product Image */}
// //       <div
// //         className="w-full h-48 bg-gray-100 rounded overflow-hidden flex items-center justify-center cursor-pointer"
// //         onClick={() => navigate(`/product/${product.id}`)}
// //       >
// //         <img
// //           src={product.image}
// //           alt={product.name}
// //           className="object-cover h-full w-full transition-transform duration-200 group-hover:scale-105"
// //         />
// //       </div>

// //       {/* Tag Badges */}
// //       <div className="mt-2 flex flex-wrap gap-1 text-xs font-medium">
// //         {product.badges?.includes("BIS") && (
// //           <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">BIS Certified</span>
// //         )}
// //         {product.securePlan && (
// //           <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Secure Plan</span>
// //         )}
// //         {product.badges?.includes("Trending") && (
// //           <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">Trending</span>
// //         )}
// //         {product.badges?.includes("Bestseller") && (
// //           <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Bestseller</span>
// //         )}
// //         {product.badges?.includes("Limited") && (
// //           <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Limited Stock</span>
// //         )}
// //         {product.badges?.includes("Fast Delivery") && (
// //           <span className="bg-teal-100 text-teal-600 px-2 py-0.5 rounded-full">Fast Delivery</span>
// //         )}
// //       </div>

// //       {/* Product Info */}
// //       <div className="mt-3">
// //         <h3
// //           className="text-sm font-semibold text-gray-800 cursor-pointer hover:text-yellow-600"
// //           onClick={() => navigate(`/product/${product.id}`)}
// //         >
// //           {product.name}
// //         </h3>
// //         <p className="text-xs text-gray-500">{product.category}</p>
// //         <p className="text-xs text-gray-600 mt-0.5">
// //           Net: {product.netWeight}g | Gross: {product.grossWeight}g
// //         </p>
// //       </div>

// //       {/* Price Section */}
// //       <div className="mt-2 text-yellow-700 font-semibold text-md">
// //         ₹{product.discountedPrice.toLocaleString()}
// //         <span className="text-gray-400 line-through text-sm ml-2">
// //           ₹{product.originalPrice.toLocaleString()}
// //         </span>
// //       </div>

// //       {/* Availability Tag */}
// //       <div className="mt-1 text-xs text-gray-600">
// //         {product.inStock ? (
// //           <span className="text-green-600">✔ In Stock</span>
// //         ) : (
// //           <span className="text-red-500">Out of Stock</span>
// //         )}
// //       </div>

// //       {/* Action Buttons */}
// //       <div className="mt-3 flex flex-col sm:flex-row gap-2">
// //         <button
// //           onClick={() => navigate("/virtual-try-on")}
// //           className="flex-1 text-xs text-pink-600 border border-pink-600 rounded px-2 py-1 hover:bg-pink-50"
// //         >
// //           👁 Try This On
// //         </button>
// //         <button className="flex-1 text-xs bg-yellow-500 text-white rounded px-2 py-1 hover:bg-yellow-600">
// //           🛒 Add to Cart
// //         </button>
// //       </div>

// //       {/* Share to WhatsApp */}
// //       <a
// //         href={`https://wa.me/?text=Check%20out%20this%20jewelry:%20https://bbscart.com/product/${product.id}`}
// //         target="_blank"
// //         rel="noopener noreferrer"
// //         className="absolute bottom-3 right-3 text-green-600 hover:text-green-700 text-lg"
// //         title="Share on WhatsApp"
// //       >
// //         <FaWhatsapp />
// //       </a>
// //     </div>
// //   );
// // };

// // export default ProductCard;
