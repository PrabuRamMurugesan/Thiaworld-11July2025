import React from 'react';
import Header from '../Header';
import CheckoutHeader from './CheckoutHeader';
import CheckoutContent from './CheckoutContent';
import CheckoutOrder from './CheckoutOrder';
function Checkout() {
  return (
    <>
    <Header/>
    <CheckoutHeader/>
    <CheckoutContent/>
    <CheckoutOrder/>
    </>
  )
}

export default Checkout