import React, { useState, useEffect } from 'react';

function ShopByBudget() {
  const [budgets, setBudgets] = useState([1499, 2499, 4999, 7499]);

  // Example if you want dynamic fetch (replace URL with your API)
  // useEffect(() => {
  //   fetch('https://your-api.com/budgets')
  //     .then(res => res.json())
  //     .then(data => setBudgets(data))
  //     .catch(err => console.error(err));
  // }, []);

  const handleClick = (amount) => {
    // Replace this with your filter logic
    alert(`Filter products under ₹${amount}`);
    console.log(`Filter products under ₹${amount}`);
  };

  return (
    <div style={{ textAlign: 'center', padding: '0px' }}>
      <h2 style={{ fontWeight: 'bold', marginBottom: '50px' }}>
        SHOP BY BUDGET
      </h2>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        {budgets.map((amount, index) => (
          <div
            key={index}
            onClick={() => handleClick(amount)}
            style={{
              border: '2px solid rgba(13,88,102)',
              padding: '40px 20px',
              width: '160px',
              height: '160px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '22px', color: '#333', marginBottom: '6px', fontFamily: 'serif ' }}>
              UNDER
            </div>
            <div style={{ fontSize: '12px', color: '#000' }}>
              ₹ {amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShopByBudget;
