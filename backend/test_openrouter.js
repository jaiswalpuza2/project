const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

async function testOpenRouter() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  console.log("Using OpenRouter API Key:", apiKey ? "FOUND (Starts with " + apiKey.substring(0, 8) + ")" : "NOT FOUND");

  if (!apiKey) {
    console.error("Error: OPENROUTER_API_KEY is missing in .env");
    console.log("Please add OPENROUTER_API_KEY=your_key_here to your .env file.");
    return;
  }

  try {
    console.log("Attempting connectivity with nvidia/nemotron-3-super-120b-a12b:free...");
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "nvidia/nemotron-3-super-120b-a12b:free",
        "messages": [
          { "role": "user", "content": "Say 'OpenRouter is working!'" }
        ]
      })
    });

    const data = await response.json();
    if (data.error) {
      console.error("OPENROUTER ERROR:", data.error.message || data.error);
    } else {
      console.log("SUCCESS:", data.choices[0].message.content);
    }
  } catch (err) {
    console.error("FAILURE DETAILS:");
    console.error("Message:", err.message);
  }
}

testOpenRouter();
