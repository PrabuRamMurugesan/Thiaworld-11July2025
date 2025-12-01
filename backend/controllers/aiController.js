
const { askAI } = require("../services/aiService.js");
exports.handleAIChat = async (req, res) => {
  try {
    const { message, brand } = req.body;

    if (!message || !brand)
      return res.status(400).json({ error: "Message and brand required" });

    const reply = await askAI(brand, message);

    res.json({ reply });
  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ error: "AI response failed" });
  }
};
