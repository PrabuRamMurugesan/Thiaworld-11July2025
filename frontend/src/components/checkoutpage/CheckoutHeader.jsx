import React,{ useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

function CheckoutHeader() {

    const [timeLeft, setTimeLeft] = useState(); // 4 minutes 30 seconds = 270 seconds
    const navigate = useNavigate();
  useEffect(() => {
    if (timeLeft <= 0)  {
        navigate("/card-product"); // Redirect to Home
        return;
      }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  return (
    <>
     <div className='checkout-header'>
        <div className='checkouts'>
          <h1 className='number-check'>1</h1>
          <h1>SHOPPING CART</h1>
        </div>
         
         <div className='straight-line'></div>

        <div className='checkouts'>
          <h1 className='number-check'>2</h1>
          <h1>CHECKOUT</h1>
        </div>
          
         <div className='straight-line'></div>

        <div className='checkouts'>
          <h1 className='number-check'>3</h1>
          <h1>ORDER STATUS</h1>
        </div>
     </div>
    <div className='checkout-footer-time'>
    <p>
    🔥 Hurry up! These products are limited, checkout within {formatTime(timeLeft)}
    </p>
    </div>

     <style>
            {`
            .checkout-header {
                display: flex;
                flex-direction: row;
                justify-content:center;
                align-items: center;
                margin-top: 20px;
                background-color: #f9f9f9;
                padding: 30px 10px;
                gap: 10px;
            }

            .checkouts {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                gap: 10px;
            }
            
            .number-check{
                width: 30px;
                height: 30px;
                border-radius: 50px;
                background-color: black;
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 16px;
                font-weight: bold;
                padding: 15px;
            }
                .straight-line{
                    width: 100px;
                    height: 1px;
                    background-color: black;
                }

                .checkout-footer-time{
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  background-color: #f9f9f9;            
                  padding: 10px;
                  font-size: 14px;
                  color: gray;
                }
                `}
        </style>

    </>
  )
}

export default CheckoutHeader