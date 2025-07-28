const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your.email@gmail.com", // replace with your email
    pass: "your-email-app-password", // generate app password from Google Account
  },
});

const sendOrderConfirmationEmail = async (order) => {
  const { name, email, cartItems, totalProductPrice, totalMaking, totalGST, grandTotal } = order;

  let productSummary = "";
  cartItems.forEach(item => {
    productSummary += `<p><strong>${item.name}</strong> - ₹${item.price} | Weight: ${item.weight}g</p>`;
  });

  const mailOptions = {
    from: '"ThiaSecure" <your.email@gmail.com>',
    to: email,
    subject: `🛒 Order Confirmation – ThiaSecure`,
    html: `
      <h2>Hi ${name},</h2>
      <p>Thank you for your order! Here’s a summary of your purchase:</p>
      ${productSummary}
      <hr />
      <p><strong>Total Product Price:</strong> ₹${totalProductPrice}</p>
      <p><strong>Total Making Charges:</strong> ₹${totalMaking}</p>
      <p><strong>Total GST:</strong> ₹${totalGST}</p>
      <p><strong>Grand Total (Payable):</strong> ₹${grandTotal}</p>
      <p>Our team will contact you shortly to finalize the details and process your order.</p>
      <br />
      <p>For queries, feel free to reach us at 📞 96007 29596 or reply to this email.</p>
      <p>Warm regards,<br/>Team ThiaSecure</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Confirmation email sent to:", email);
  } catch (err) {
    console.error("❌ Failed to send confirmation email:", err);
  }
};

module.exports = { sendOrderConfirmationEmail };
