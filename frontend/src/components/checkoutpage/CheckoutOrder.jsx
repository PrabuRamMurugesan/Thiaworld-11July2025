import React from "react";
import { SiRazorpay } from "react-icons/si";
import { GiCash } from "react-icons/gi";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoMdPerson } from "react-icons/io";
import { BsTicketPerforated } from "react-icons/bs";
function CheckoutOrder() {
  return (
    <>
      <div className="checkout-order-container">
        <div className="checkout-header">
          <div className="checkouts">
            <h1 className="number-check">1</h1>
            <h1>SHOPPING CART</h1>
          </div>

          <div className="straight-line"></div>

          <div className="checkouts">
            <h1 className="number-check">2</h1>
            <h1>CHECKOUT</h1>
          </div>

          <div className="straight-line"></div>

          <div className="checkouts">
            <h1 className="number-check">3</h1>
            <h1>ORDER STATUS</h1>
          </div>
        </div>
        <div className="checkout-order-page">
          <div className="price-bill">
            <h1>YOUR ORDER</h1>
            <div className="price-bill-container">
              <div className="price-bill-image">
                <img src="/assets/R.png" alt="" />
              </div>

              <div className="price-bill-details">
                <h3>Gold Necklace</h3>
                <div className="price-bill-amount">
                  <div>
                    <button>-</button>
                    <span>1</span>
                    <button>+</button>
                  </div>
                  <div>
                    <h4>
                      <span className="text-red-600">Payment Plan:</span>{" "}
                      Initial 40%
                    </h4>
                  </div>
                  <div>
                    <h4>
                      Initial Payment 40% should be paid Total $10,000 payable
                      next Installment Amount $10,000 Next Payment Date:
                      <span className="text-red-600">
                        {" "}
                        May 15, 2025 4:00 PM
                      </span>
                    </h4>
                  </div>
                  <div>
                    <h4>
                      x <span className="text-stone-800">$10,000</span>
                    </h4>
                  </div>
                  <div>
                    <h4>
                      Initial Payment 40% should be paid Total $10,000 payable
                      next Installment Amount $10,000 Next Payment Date:
                      <span className="text-red-600">
                        {" "}
                        May 15, 2025 4:00 PM
                      </span>
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="price-bill-total">
              <h2> Subtotal: $19,000</h2>
              <h3>Balance $1,000 payable</h3>
            </div>
            <div className="price-bill-total">
              <h4 className="">
                Subtotal: <span>$19,000</span>
              </h4>
              <h4 className="">
                Shipping: <span>Free Shipping</span>
              </h4>
              <h4 className="">
                GST <span>$1,000</span>
              </h4>
            </div>

            <div className="price-total">
              <h2>$22,000</h2>
              <h2>PAYABLE NOW</h2>
            </div>

            <div>
              <h2 className="mx-9">TOTAL </h2>
              <div className="price-bill-total-amount">
                <h4>
                  Balance Payable Amount<span>$1,000 (ex vat)</span>
                </h4>
                <h4 className="pbta-h4">
                  Total Payable Amount<span>$22,000 (ex vat)</span>
                </h4>
              </div>
            </div>
            <label className="cash-debit">
              <input type="radio" />
              <div className="payment-info">
                <h4>Credit Card / Debit Card / Net Banking</h4>
                <span>
                  <SiRazorpay /> Pay by Razorpay
                </span>
              </div>
            </label>
            <p className="payment-infom">
              Pay securely by Credit or Debit Card or Internet Banking through
              Razorpay
            </p>
            <div className="final-razorpay">
              <label className="">
                <input type="radio" />
              </label>

              <h4>CCAvenue</h4>
            </div>

            <span className="payment-infom">
              Your personal data will be used to process your order, support
              your experience throughout this website, and for other purposes
              described in our privacy policy
            </span>
            <div className="final-razorpay">
              <label className="">
                <input type="checkbox" />
              </label>
              <h4>I have read and agree to the terms and conditions</h4>
            </div>

            <button
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f5a4",
                padding: "10px 20px",
                borderRadius: "15px",
                width: "fit-content",
                margin: "10px auto",
                cursor: "pointer",
              }}
            >
              <GiCash className="mr-2" />
              Place Order
            </button>

            <fieldset className="safety-check-one">
              <legend>
                GUARANTEED <span className="color-brown"> SAFE</span> CHECKOUT
              </legend>
              <div className="box-maintance">
                <div className="box-salfety"></div>
                <div className="box-salfety"></div>
                <div className="box-salfety"></div>
                <div className="box-salfety"></div>
                <div className="box-salfety"></div>
                <div className="box-salfety"></div>
              </div>
            </fieldset>

            <h1>Your payment is 100% secure</h1>
          </div>
        </div>
      </div>

      <style>{`

        .safety-check-one {
            width: 500px;
    height: 100px;
    border: 1px solid gray; 
    border-radius: 5px;
    margin: 50px 10px; 
        }

           .safety-check-one legend {
    text-align: center;
    font-weight: bold;
    padding: 0 10px;
    font-size: 20px;
    }

    .box-maintance{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items:center;
    gap: 20px;
    padding: 10px 10px;
    }
        .checkout-order-container {
          padding: 0px 10%;
        }

        .checkout-order-page {
          width: 100%;
          margin: 30px auto;
          padding: 20px;
          display: flex;
          flex-direction: row;
          gap: 20px;
          flex-wrap: nowrap;
          box-sizing: border-box;
        }

        .checkout-order {
          width: 50%;
          display: flex;
          flex-direction: column;
          padding: 35px 0px;
        }

        .checkout-order h1 {
          font-size: 20px;
          font-weight: 600;
          font-family: 'Times New Roman', Times, serif;
        }

        .name-check {
          display: flex;
          flex-wrap: wrap;
          justify-content: start;
          margin: 5px 0px;
          padding: 10px 0px;
          border-top: 1px solid black;
          gap: 10px;
        }

        .first-name-check,
        .last-name-check {
          width: 100%;
        }

        .country-check {
          display: flex;
          flex-direction: column;
          margin-bottom: 15px;
        }

        .country-check label {
          margin-bottom: 5px;
          font-weight: 500;
        }

        .price-bill {
          border: 1px solid black;
          border-radius: 5px;
          padding: 10px;
          width: 50%;
        }

        .price-bill h1 {
          color: #e09f53;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Times New Roman', Times, serif;
          border-bottom: 1px solid black;
          padding-bottom: 5px;
          margin: 10px 35px 15px 35px;
        }

        .order-notes {
          display: flex;
          flex-direction: column;
          margin-bottom: 15px;
        }

        .order-notes label {
          margin-bottom: 5px;
          font-weight: 500;
        }

        .order-notes textarea {
          border: 1px solid black;
          border-radius: 5px;
          width: 100%;
          height: 150px;
          padding: 5px;
          margin-top: 5px;
          margin-bottom: 10px;
        }
          .price-total{
           text-align: end;
           padding: 0px 35px;
          }

        @media (min-width: 600px) {
          .first-name-check,
          .last-name-check {
            width: 48%;
          }
        }

        .checkout-order {
          input { border: 1px solid black;
          border-radius: 5px;
          width: 100%;
          padding: 5px;
          margin-top: 5px;
          margin-bottom: 10px;
         }
        }

        .company-name-check {
          margin-bottom: 10px;
        }

        .price-bill-image {
      display: flex; 
      justify-content: center;
       align-items: center;
      position: relative;
        }

        .price-bill-image img {
          position: absolute;
          top: 30px;
          left: 40px;
        }

        .price-bill-container {
          display: flex;
          flex-direction: row;
        }
        .price-bill-details{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 60%;
        }
        .price-bill-amount {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 10px;
          padding: 20px 80px;
          font-size: 15px;
          font-family: 'Times New Roman', Times, serif;
        }
          .price-bill-total {
           margin: 20px 20px;
         
           h3{
           border-bottom: 1px solid black;
          }
           
          h2,h3{
            padding: 0px 30px;
           }
      }
            .price-bill-total-amount{
                
              display: flex;
              flex-direction: column;
              border-radius: 5px;
              padding: 10px;
              
              
              h4{
                display: flex;
                justify-content: space-between;
                padding: 5px 10px;
                font-family: 'Times New Roman', Times, serif;
                
              }
            }
              .pbta-h4{
              border-bottom: 1px solid black;
              }
              
              
            .cash-debit {
  display: flex;
  align-items: center;
  gap: 20px;
  border-radius: 6px;
  padding: 10px 15px;
  cursor: pointer;
  margin-bottom: 15px;
}

.cash-debit input[type="radio"] {
  accent-color: #e09f53;
  transform: scale(1.2);
}

.payment-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
}

.payment-info h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
}

.payment-info span {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #555;
  white-space: nowrap;
}
.final-razorpay{
display: flex;
gap: 10px;
padding: 0px 15px;
}

.payment-infom{
  padding: 0px 15px;
  align-items: center;
  text-align: justify;
}
   .buy-now-card-product{
      background-color: black;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      margin: 10px 20px;
 
    }
      .price-bill-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .price-bill-container {
    flex-direction: row;
    align-items: flex-start;
  }

  .price-bill-image {
    width: 30%;
  }

  .price-bill-details {
    width: 70%;
  }
}

.price-bill-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

@media (max-width: 768px) {
  .checkout-order-page {
    flex-direction: column;
    padding: 10px;
  }

  .checkout-order,
  .price-bill {
    width: 100%;
  }

  .price-bill-amount {
    flex-direction: column;
    padding: 10px;
    text-align: center;
  }

  .price-bill-image img {
    position: static;
  width: 50%;
    height: auto;
  }

  .price-bill-container {
    flex-direction: column;
    align-items: center;
  }

  .price-bill-details {
    width: 100%;
    align-items: center;
  
  }

  .safety-check-one {
   display: flex;
   flex-direction: column;
   align-items: center;
   flex-wrap: no-wrap; 
      width: 80%;
    height: auto;
    padding: 10px;
    margin: 30px auto;
  }

  .box-maintance{
    display: flex;
    flex-direction:row;
    align-items: center;
  }
  .box-salfety{
    width: 40px;
    height: 35px;
  }
  
    legend {
      
    font-size: 12px;
    }
  }
    

  .final-razorpay,
  .payment-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  button {
    width: 100%;
    padding: 12px;
    font-size: 16px;
  }

  input[type="text"],
  select,
  textarea {
    font-size: 16px;
  }
}


      `}</style>
    </>
  );
}

export default CheckoutOrder;
