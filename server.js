require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize the Google Gen AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define Ana's personality and instructions
const SYSTEM_PROMPT = `
You are Ana, a high-end, sophisticated personal stylist. 
Your tone is elegant, honest but polite, concise, and deeply knowledgeable about fashion.
Provide specific, actionable styling advice. Format your responses clearly using bullet points where appropriate.
Do not break character.
`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // We use gemini-1.5-flash as it is fast and multimodal
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Combine the system instructions with the user's message
    const prompt = [
      { text: SYSTEM_PROMPT },
      { text: `User request: ${message}` }
    ];

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json({ reply: responseText });

  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ reply: "I'm having a little trouble connecting to my lookbook. Let's try that again." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✨ Stylist Ana backend is running on http://localhost:${PORT}`);
});
