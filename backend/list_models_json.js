const axios = require("axios");
require("dotenv").config();
const fs = require("fs");

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    try {
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        fs.writeFileSync("models_list.json", JSON.stringify(response.data, null, 2));
        console.log("Saved to models_list.json");
    } catch (err) {
        console.error("Error:", err.response ? err.response.data : err.message);
    }
}

listModels();
