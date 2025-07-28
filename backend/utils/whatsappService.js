const sendOrderConfirmationWhatsApp = async (order) => {
    const { name, phone, cartItems, totalProductPrice, totalMaking, totalGST, grandTotal } = order;
  
    let productSummary = "";
    cartItems.forEach(item => {
      productSummary += `${item.name} - ₹${item.price} | Weight: ${item.weight}g\n`;
    });
  
    const message = `
  👋 Hi ${name},
  Thank you for your order! Here’s your purchase summary:
  
  ${productSummary}
  Total Product Price: ₹${totalProductPrice}
  Total Making Charges: ₹${totalMaking}
  GST: ₹${totalGST}
  Grand Total: ₹${grandTotal}
  
  We’ll contact you soon. For help, reply here or call 📞 96007 29596.
  `;
  
    // Simulated WhatsApp Message (Replace with real API integration when ready)
    console.log("📲 [WhatsApp message placeholder]:", message);
  
    // TODO: Replace with real API call to Twilio or Gupshup
    // Example:
    // await axios.post('https://api.gupshup.io/wa/message', { ... });
  };
  
  module.exports = { sendOrderConfirmationWhatsApp };
  