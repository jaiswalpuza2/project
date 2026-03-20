require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testModel(modelName) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: modelName });
  try {
    const result = await model.generateContent("hi");
    const response = await result.response;
    console.log(`[PASS] ${modelName}: ${response.text().trim()}`);
    return true;
  } catch (err) {
    console.log(`[FAIL] ${modelName}: ${err.message}`);
    return false;
  }
}

async function run() {
  const models = [
    "gemini-flash-latest",
    "gemini-pro-latest",
    "gemini-1.5-flash-latest",
    "gemini-2.5-flash",
    "gemini-3-flash-preview"
  ];
  
  for (const m of models) {
    await testModel(m);
  }
}

run();
