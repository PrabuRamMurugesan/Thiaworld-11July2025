import React from "react";
import logo from "../../public/assets/thia.png";
const sections = {
  "Jewellery By Collections": ["Earrings", "Ring", "Mangalsutra", "Necklace", "Nosepin", "Chains", "Anklets", "Pendants", "Toe", "Rings", "Bangles", "Bracelets"],
  "Jewellery": ["Solitaire", "Gold", "Jewellery", "Silver", "Jewellery", "Diamond", "Jewellery", "Rose", "Gold", "Jewellery", "Platinum", "Jewellery", "Oxidized", "Jewellery", "White", "Gold", "Jewellery", "Yellow", "Gold", "Jewellery"],
  "Jewellery by Occasion": ["Traditional", "Wear", "Jewellery", "Party", "Wear", "Jewellery", "Office", "Wear", "Jewellery", "Everyday", "Wear", "Jewellery", "Casual", "Wear", "Jewellery"],
  "Men's Jewellery": ["Men's", "Silver", "Jewellery", "Men's", "Gold", "Bangles", "Bracelets", "Men's", "Silver", "Bangles", "Bracelets", "Men's", "Platinum", "Rings", "Men's", "Jewellery"],
  "Women's Jewellery": ["Women's", "Gold", "Bangles", "Bracelets", "Women's", "Gold", "Nosepins", "Women's", "Gold", "Mangalsutras"],
  "GRT Exclusive":["Gift Voucher"," GRT Saving Scheme"," GRT Verse"],
  " GRT Verse":["Trinka Jewellery Collections ","Younglamm Jewellery Collections"," Thea Jewellery Collections","Ruya Jewellery Collections","Elysia Jewellery Collections",
  "Oriana Jewellery Collections","Mudra Jewellery Collections","Rosette Jewellery Collections ","Resin Jewellery Collections","Vibha Jewellery Collections"
  ]
};
      
const PopularSearch = () => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#fde9e5", color: "#5c1a1a", padding: "2rem" }}>
 <div
  className="d-flex align-items-center justify-content-between gap-3 my-4"
  style={{
    borderBottom: "2px solid #5c1a1a", // adjust thickness & color
    paddingBottom: "15px", // remove padding that softens the line
  }}
>
  <h1 style={{ fontSize: "3.5rem", marginBottom: "0" }}>Popular Search</h1>
  <img src={logo} alt="Logo" style={{ height: "95px", width: "auto" }} />
</div>



      {Object.entries(sections).map(([sectionTitle, items], i) => (
        <div key={i} style={{ marginBottom: "2rem" }}>
          <h3 style={{ marginBottom: "0.75rem" }}>{sectionTitle}</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {items.map((item, index) => (
              <a
                key={index}
                href="/products"
                style={{
                  textDecoration: "none",
                  color: "#5c1a1a",
                  background: "#f2d3f550",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.9rem",
                  minWidth: "fit-content",
                  textAlign: "center",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PopularSearch;
