import React, { useState, useEffect } from 'react';

const products = [
  {
    title: 'Royal Gold Necklace',
    image: '/assets/Banner1.jpg',
  },
  {
    title: 'Elegant Gold Ring',
    image: '/assets/Banner3.jpg',
  },
  {
    title: 'Luxury Gold Bracelet',
    image: '/assets/Banner2.jpg',

  },
  // {
  //   title: 'Classic Gold Earrings',
  //   image: 'https://www.woodbridgejewelry.com/wp-content/uploads/2019/01/banner-image3-800x500.jpg',
  // },
  // {
  //   title: 'Premium Gold Watch',
  //   image: 'https://wallpapercat.com/w/full/8/9/3/2309733-2000x1115-desktop-hd-fashion-jewelry-background.jpg',
  // },
];

function GoldAdSlider() {
  const [current, setCurrent] = useState(0);

  // Automatically change slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '600px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}
    >
      {products.map((product, index) => (
        <div
          key={index}
          style={{
            backgroundImage: `url(${product.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'absolute',
            top: 0,
            left: `${(index - current) * 100}%`,
            minWidth: '100%',
            height: '100%',
            transition: 'left 0.5s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '24px',
            flexDirection: 'column',
            // backgroundColor: 'rgba(0, 0, 0, 0.4)', // optional dark overlay
          }}
        >
          <div className='d-flex justify-content-start flex-column align-items-start w-100 p-5'>
            <div
            style={{
              padding: '10px 20px',
              borderRadius: '5px',
              color: 'gold',
              fontWeight: 'bold',
              fontSize: '55px',
              fontFamily: 'Arial, sans-serif',
              textShadow: '10px -10px 8px rgba(0, 0, 0, 0.5)',
            }}
          >
            {product.title}
          </div>
          <button
            style={{
              backgroundColor: 'rgba(13,88,102)',
              boxShadow: '0 2px 2px rgba(0,0,0,0.3)',
      
              padding: '5px 25px',
              borderRadius: '50px',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              marginLeft: '16%',
            }}
          >
            Shop Now
          </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GoldAdSlider;
