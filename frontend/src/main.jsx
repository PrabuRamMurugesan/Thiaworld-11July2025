import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { CartProvider } from "./context/CartContext"; // ✅ Correct import
import { AuthProvider } from "../context/AuthContext"; // ✅ import

import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </CartProvider>
  </React.StrictMode>
);