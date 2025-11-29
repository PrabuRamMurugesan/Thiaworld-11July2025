const Subscriber = require("../models/Subscriber");
const nodemailer = require("nodemailer");

exports.subscribeUser = async (req, res) => {
    console.log("SUBSCRIBE API HIT", req.body);

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Save to DB
    await Subscriber.create({ email });

    // SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
console.log("SUBSCRIBE API HIT", req.body);

    // Mail to admin
    await transporter.sendMail({
      from: `Thiaworld Jewellery <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: "New Newsletter Subscriber",
      text: `A new user subscribed: ${email}`,
    });

    return res.json({ success: true, message: "Subscription successful" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
