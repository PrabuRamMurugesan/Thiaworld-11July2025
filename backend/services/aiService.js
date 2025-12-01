
const OpenAI = require("openai");
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.askAI = async (brand, message) => {
  const systemPrompts = {
    thia: `
You are Thia Genie. 
Brand: Thiaworld Jewellery.
Be warm, premium and friendly.
Help with: gold jewellery, designs, customizing, gold plans, gifting ideas, purity, pricing, buy guidance.
No medical or ecommerce topics.
`,
    bbscart: `
You are BBS Assistant.
Brand: BBSCART eCommerce super-app.
Help with: orders, returns, delivery tracking, product search, categories, deals, cart help.
No jewellery or medical topics.
`,
    health: `
You are Care Assistant.
Brand: BBS Global Health Access.
Help with: health plans, benefits, coverage, hospital networks, OPD, diagnostics, family plans.
No ecommerce or jewellery info.
`,
  };

  const systemPrompt = systemPrompts[brand] || "You are a helpful assistant.";

  const completion = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
  });

  return completion.choices[0].message.content;
};
