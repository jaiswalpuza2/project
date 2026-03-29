const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

async function test() {
  console.log("Using API Key:", process.env.GEMINI_API_KEY ? "FOUND (Starts with " + process.env.GEMINI_API_KEY.substring(0, 8) + ")" : "NOT FOUND");

  if (!process.env.GEMINI_API_KEY) {
      console.error("Error: GEMINI_API_KEY is missing in .env");
      return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    console.log("Attempting connectivity with gemini-2.0-flash...");
    const result = await genAI.getGenerativeModel({ model: "gemini-2.0-flash" }).generateContent("hi");
    console.log("SUCCESS:", result.response.text());

  } catch (err) {
    console.error("FAILURE DETAILS:");
    console.error("Message:", err.message);
  }
}
test();
