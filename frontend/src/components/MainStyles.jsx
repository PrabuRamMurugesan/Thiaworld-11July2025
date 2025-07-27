import React from 'react';

function MainStyles() {
  // All image data in one array (easy to update)
  const imageData = [
    { title: 'New Arrivals', src: 'https://images-static.nykaa.com/media/catalog/product/1/1/1139c48FIDAX00000853_1.jpg' },
    { title: 'Best Sellers', src: 'https://picsum.photos/seed/mountain/100' },
    { title: 'Earrings', src: 'https://picsum.photos/seed/ocean/100' },
    { title: 'Jewellery Sets', src: 'https://picsum.photos/seed/forest/100' },
    { title: 'Wristwear', src: 'https://picsum.photos/seed/city/100' },
    { title: 'Ethnic', src: 'https://picsum.photos/seed/desert/100' },
    { title: 'Necklace', src: 'https://picsum.photos/seed/river/100' },
    { title: 'Rings', src: 'https://picsum.photos/seed/flowers/100' },
    { title: '925 Silver', src: 'https://picsum.photos/seed/snow/100' },
    { title: 'Voguish', src: 'https://picsum.photos/seed/valley/100' },
    { title: 'Western', src: 'https://picsum.photos/seed/skyline/100' },
  ];

  return (
    <div style={{ padding: '20px',cursor: 'pointer' }}>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
        }}
      >
        {imageData.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src={item.src}
              alt={item.title}
              width="100"
              height="100"
              style={{
                borderRadius: '30% 40% 0% 30%',
                objectFit: 'cover',
                border: '1px solid rgba(13,88,102)',
                padding: '4px', 
                
              }}
            />
            <span style={{ marginTop: '5px', fontSize: '14px' }}>
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainStyles;
