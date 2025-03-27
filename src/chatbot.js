import React, { useState, useRef, useEffect } from "react";

// Note: In production, never expose your API key client-side. Use a backend proxy.
const GEMINI_API_KEY = "AIzaSyDo3Zf_X8RuNk1ZEPPD4jjzIOErz_lUzNM"; // Replace with your actual key
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Chatbot logic using Gemini API
  const getBotResponse = async (userInput) => {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: userInput,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botText = data.candidates[0]?.content?.parts[0]?.text || "I didn’t understand that.";

      // Map your existing logic to Gemini responses (optional refinement)
      const inputLower = userInput.toLowerCase().trim();
      if (inputLower.includes("hello") || inputLower.includes("hi")) {
        const greetings = ["Hi there!", "Hello, friend!", "Hey, nice to see you!"];
        return greetings[Math.floor(Math.random() * greetings.length)];
      } else if (inputLower.includes("time")) {
        return `It’s currently ${new Date().toLocaleString()}.`;
      } else if (inputLower.includes("math")) {
        const match = inputLower.match(/what is (\d+) \+ (\d+)/);
        if (match) {
          const [, num1, num2] = match;
          return `${num1} + ${num2} = ${parseInt(num1) + parseInt(num2)}`;
        }
      }

      // Return Gemini's response if no specific mapping applies
      return botText;
    } catch (error) {
      console.error("Error fetching Gemini API response:", error);
      return "Oops, something went wrong. Try again!";
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    // Add user message
    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);

    // Generate bot response
    const botResponse = await getBotResponse(input);
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
    }, 500); // Simulate a slight delay

    setInput(""); // Clear input
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold tracking-tight">Your Chatbot!</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            Hi! I’m here to help you. Say "hello" to start!
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`max-w-md p-4 rounded-xl shadow-sm ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t shadow-inner">
        <div className="flex items-center max-w-3xl mx-auto gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-800"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;