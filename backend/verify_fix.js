const aiService = require("./utils/aiService");
require("dotenv").config();

async function verify() {
    console.log("--- Testing Dynamic Mock Responses ---");
    const queries = [
        "How can I find a job?",
        "Help me with my profile",
        "What is JobSphere?",
        "Just saying hello"
    ];

    for (const q of queries) {
        const response = aiService.getMockResponse("chatbot", q);
        console.log(`Query: "${q}"`);
        console.log(`Mock Response: "${response}"\n`);
    }

    console.log("--- Testing AI Generation (Gemini) ---");
    try {
        const response = await aiService.generateContent("What is the best way to find a job on JobSphere?", "chatbot");
        console.log("AI Response:", response);
    } catch (err) {
        console.error("AI Generation Error (Expected if rate-limited):", err.message);
    }
}

verify();
