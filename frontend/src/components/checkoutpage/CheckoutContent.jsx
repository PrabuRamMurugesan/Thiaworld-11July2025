import React from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoMdPerson } from "react-icons/io";
import { BsTicketPerforated } from "react-icons/bs";
function CheckoutContent() {
  return (
    <>
      <div className="checkout-success-container">
        <div className="checkout-success">
          <span className="checkout-success-title">
            <IoIosCheckmarkCircle className="me-2" /> "Double Heart Gold
            Bracelet" has been added to your cart
          </span>

          <span className="underline">
            <a href="">View Cart</a>
          </span>
        </div>

        <div className="return-custumer">
          <span className="return-custumer-title"><IoMdPerson className="me-1"/> Returning custumer?  <a href="" className="underline mx-1">Click here to login</a> </span>
            <p>If you have shopped with us before,
                 please enter your details below. 
                 If you are a new customer, 
                 please proceed to the billing section.
            </p> 
            </div>

            <div className="checkout-login-page">
               <div className="checkout-login">
               <label htmlFor="Username or email">Username or email *</label>
               <input type="text" placeholder="Username or email" />
               <label htmlFor="Password">Password *</label>
               <input type="password" placeholder="Password" />
               </div>

             <div className="checkout-login-checkbox">
             <p>Remember me</p> 
             <p>Forgot Password</p>
             </div>
                <button>Login</button>
                <h2 className="checkout-coupon"><BsTicketPerforated className="me-1"/> Have a coupon? <a href="" className="underline">Click here to enter your code</a></h2>
            </div>
      </div>

      <style>
        {`
         .checkout-success-container{
         padding: 0 10%;
         }
         .checkout-success{
         display: flex;
         justify-content: space-between;
         align-items: center;
         padding: 10px 20px;
         border: 1px solid black;
         border-radius: 5px;
         margin: 20px 0;
         background-color:#439c36;
         }
         .checkout-success-title{
         display: flex;
         align-items: center;
         }

         .return-custumer{
          color: gray;
          margin: 0px 20px;
         }

         .return-custumer-title{
          display: flex;
          align-items: center;
          row-gap: 10px;
        }
        .checkout-login-page{
        margin: 10px 20px;  

        button{
        background-color:crimson;
        color: white;
        padding: 5px 25px;
        border-radius: 8px;
        margin: 0 10px ;
        }
        .checkout-login{
                 display: flex;
        flex-direction: column;
        
        input{
        border: 1px solid gray;
        border-radius: 5px;
        padding: 5px 10px;
        }
        }

        .checkout-login-checkbox{
         display: flex;
         justify-content: space-between;
         padding: 5px 10px;
        }
         .checkout-coupon{
         display: flex;
         align-items: center;
         margin: 10px 5px;
         }
      `}
      </style>
    </>
  );
}

export default CheckoutContent;
