const express = require("express");
const fetch = require("node-fetch");
const app = express();

const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"; // Replace with your key from Google AI Studio
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});