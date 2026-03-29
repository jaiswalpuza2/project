const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API key found.");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        const axios = require("axios");
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        console.log("Available Models:");
        response.data.models.forEach(m => console.log(m.name));
    } catch (err) {
        console.error("Error listing models:", err.response ? err.response.data : err.message);
    }
}

listModels();
