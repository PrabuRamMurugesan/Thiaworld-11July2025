import React from 'react';

function BottomAd() {
  return (
    <>
      {/* Heading Section */}
      <div className='bg-cyan-50'
        style={{
          textAlign: "center",
          padding: "50px 0 30px",
          
        }}
      >
        <h1 style={{ marginBottom: "10px", fontWeight: "700", fontSize: "40px", }}>Have your own story?</h1>
        <p style={{ marginBottom: "30px", fontSize: "35px", color: "#555" }}>
          We'd love to feature you on our website and social channels!
        </p>

        {/* Category Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "20px"
          }}
        >
          {["Earning", "Bangles", "Casual Wear", "Diamond", "Necklace", "Bridal"].map(
            (name, index) => (
              <button
                key={index}
                style={{
                  background: "#d4af37",
                  border: "none",
                  padding: "10px 18px",
                  fontSize: "14px",
                  color: "#fff",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontWeight: "600",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#b8912f")}
                onMouseLeave={(e) => (e.target.style.background = "#d4af37")}
              >
                {name}
              </button>
            )
          )}
        </div>
      </div>

      {/* Gallery Section */}
      <div  className='bg-cyan-50'
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "25px",
          flexWrap: "wrap",
          paddingBottom: "60px",
      
        }}
      >
        {[
          {
            img: "https://images-static.nykaa.com/media/catalog/product/tr:h-800,w-800,cm-pad_resize/e/5/e5d7939QPRIYA00001589_1.jpg",
            title: "Gold Earrings",
            link: "https://example.com/earrings"
          },
          {
            img: "https://img.freepik.com/premium-photo/crystal-clear-attractive-girl-wearing-jewelry-with-diamond_1265719-569.jpg",
            title: "Diamond Ring",
            link: "https://example.com/diamond-ring"
          },
          {
            img: "https://www.caratlane.com/blog/wp-content/uploads/2025/03/22k-gold-bracelets.jpg",
            title: "Bangles Collection",
            link: "https://example.com/bangles"
          },
          {
            img: "https://img.freepik.com/premium-photo/woman-wearing-necklace-with-necklace-that-says-she-s-wearing-it_910054-10194.jpg?w=900",
            title: "Necklace Set",
            link: "https://example.com/necklace"
          },
          {
            img: "https://i.pinimg.com/originals/92/1b/0d/921b0d7d1a9e17c6b94eec40b81d233e.png",
            title: "Casual Lifestyle",
            link: "https://example.com/casual"
          },
          {
            img: "https://img.freepik.com/premium-photo/beautiful-girl-wearing-traditional-bridal-dress-with-jewelry_615731-7750.jpg?w=2000",
            title: "Bridal Look",
            link: "https://example.com/bridal"
          },
        ].map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "#000",
              textAlign: "center",
              width: "200px"
            }}
          >
            <img
              src={item.img}
              alt={item.title}
              style={{
                width: "200px",
                height: "220px",
                borderRadius: "12px",
                objectFit: "cover",
                boxShadow: "0 5px 15px rgba(0,0,0,0.12)",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            />
            <h6 style={{ marginTop: "10px", fontWeight: "600" }}>{item.title}</h6>
          </a>
        ))}
      </div>
    </>
  );
}

export default BottomAd;
