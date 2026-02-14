import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from "../../public/assets/thia.png";

// previously static sections were hard‑coded; keep them as a fallback
const staticSections = {
  "Jewellery By Collections": [
    "Earrings",
    "Ring",
    "Mangalsutra",
    "Necklace",
    "Nosepin",
    "Chains",
    "Anklets",
    "Pendants",
    "Toe",
    "Rings",
    "Bangles",
    "Bracelets",
  ],
  "Jewellery": [
    "Solitaire",
    "Gold Jewellery",
    "Silver Jewellery",
    "Diamond Jewellery",
    "Rose Gold Jewellery",
    "Platinum Jewellery",
    "Oxidized Jewellery",
    "White Gold Jewellery",
    "Yellow Gold Jewellery",
  ],
  "Jewellery by Occasion": [
    "Traditional",
    "Party",
    "Office",
    "Everyday",
    "Casual",
  ],
  "Men's Jewellery": [
    "Men's Silver Jewellery",
    "Men's Gold Bangles",
    "Bracelets",
    "Men's Platinum Rings",
  ],
  "Women's Jewellery": [
    "Women's Gold Bangles",
    "Bracelets",
    "Nosepins",
    "Mangalsutras",
  ],
  "GRT Exclusive": ["Gift Voucher", "GRT Saving Scheme", "GRT Verse"],
};

const PopularSearch = () => {
  const [sections, setSections] = React.useState(staticSections);

  // helper to choose query param based on section title
  const getParamForSection = (title) => {
    // map the section heading to an API query parameter
    switch (title) {
      case "Jewellery By Collections":
        return "category";
      case "Jewellery by Occasion":
        return "occasion";
      case "Men's Jewellery":
      case "Women's Jewellery":
        return "gender";
      default:
        // tags, generic jewellery, etc., fall back to search
        return "search";
    }
  };

  // helper to build URL for a given term and section
  const makeLink = (term, sectionTitle) => {
    const q = encodeURIComponent(term.trim());
    const param = getParamForSection(sectionTitle);
    return `/all-jewellery?${param}=${q}`;
  };

  React.useEffect(() => {
    // attempt to fetch a list of products and generate unique categories/tags
    // fallback to static sections if network fails
    const loadDynamic = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URI}/products/all`);
        const items = Array.isArray(res.data) ? res.data : [];
        const cats = new Set();
        const tgs = new Set();
        const occ = new Set();
        const men = new Set();
        const women = new Set();

        items.forEach((p) => {
          if (p.category) cats.add(p.category);
          if (Array.isArray(p.tags)) p.tags.forEach((t) => tgs.add(t));
          if (p.occasion) occ.add(p.occasion);
          if (p.gender === "Men's" || /men/i.test(p.gender)) men.add(p.category || p.tags?.[0] || "");
          if (p.gender === "Women's" || /women/i.test(p.gender)) women.add(p.category || p.tags?.[0] || "");
        });

        setSections((prev) => ({
          ...prev,
          "Jewellery By Collections": Array.from(cats),
          Jewellery: Array.from(tgs),
          "Jewellery by Occasion": Array.from(occ),
          "Men's Jewellery": Array.from(men),
          "Women's Jewellery": Array.from(women),
        }));
      } catch (err) {
        console.warn("Failed to load dynamic popular search data", err);
      }
    };
    loadDynamic();
  }, []);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#fde9e5",
        color: "#5c1a1a",
        padding: "2rem",
      }}
    >
      <div
        className="d-flex align-items-center justify-content-between gap-3 my-4"
        style={{
          borderBottom: "2px solid #5c1a1a",
          paddingBottom: "15px",
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
              <Link
                key={index}
                to={makeLink(item, sectionTitle)}
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
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PopularSearch;
