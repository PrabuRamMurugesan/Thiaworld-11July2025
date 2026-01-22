// backend/utils/sendEmail.js
const nodemailer = require("nodemailer");

// Validate SMTP configuration
if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn("⚠️ SMTP configuration is incomplete. Email sending may fail.");
  console.warn("Required env variables: SMTP_HOST, SMTP_USER, SMTP_PASS");
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: `"Thiaworld Admin" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log("📧 Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

module.exports = sendEmail;
