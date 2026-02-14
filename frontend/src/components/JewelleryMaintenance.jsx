import React, { useEffect, useState } from 'react';
import axios from 'axios';

function JewelleryMaintenance() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // static fallback list used while there is no data from server
  const fallback = [
    {
      id: 1,
      title: "Cleaning Gold Jewellery",
      description: "Learn how to safely clean your gold jewellery at home to maintain its shine.",
      image: "https://cdn.itshot.com/media/catalog/product/m/e/mens-iced-out-pave-diamond-bubble-bracelet-975ct-p-6170_ro_1.jpg?w=1",
    },
    {
      id: 2,
      title: "Silver Jewellery Care",
      description: "Tips to prevent tarnish and keep your silver jewellery looking new.",
      image: "https://www.24diamonds.com/47840/14k-rose-gold-miami-cuban-link-mens-bracelet-10-5-mm-8-inches.jpg",
    },
    {
      id: 3,
      title: "Diamond Maintenance",
      description: "Ensure your diamonds sparkle with these simple care tips.",
      image: "https://tse2.mm.bing.net/th/id/OIP.5mhKtF0qZUIG4inckR0uqQHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    {
      id: 4,
      title: "Storage Tips",
      description: "How to properly store your jewellery to avoid damage and scratches.",
      image: "https://tse3.mm.bing.net/th/id/OIP.6T_Wxiw0WziSgkUtoeUJ0wHaE8?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
    },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URI}/maintenance`);
        if (Array.isArray(res.data) && res.data.length) {
          setCards(res.data);
        } else {
          setCards(fallback);
        }
      } catch (err) {
        console.warn("Failed to load maintenance guide, using fallback", err);
        setCards(fallback);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const display = loading ? fallback : cards;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px", color: "#5c4b00" }}>
        Jewellery Maintenance Guide
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {display.map((card) => (
          <div
            key={card._id || card.id}
            style={{
              flex: "1 1 300px",
              background: "#fff8e1",
              borderRadius: "12px",
              padding: "15px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <img
              src={card.image}
              alt={card.title}
              style={{
                width: "100%",
                height: "350px", // fixed height for uniformity
                objectFit: "cover", // ensures proper cropping
                borderRadius: "12px",
                marginBottom: "10px",
              }}
            />
            <h2
              style={{
                fontSize: "18px",
                marginBottom: "8px",
                color: "#5c4b00",
              }}
            >
              {card.title}
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#5c4b00",
                marginBottom: "10px",
              }}
            >
              {card.description}
            </p>
            <button
              style={{
                background: "linear-gradient(90deg, #f9d423, #ff4e50)",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "0.3s",
              }}
            >
              Read More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JewelleryMaintenance