require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

async function testModel(modelName) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: modelName });
  try {
    const result = await model.generateContent("hi");
    const response = await result.response;
    return { name: modelName, status: "PASS", message: response.text().substring(0, 30) };
  } catch (err) {
    return { name: modelName, status: "FAIL", error: err.message };
  }
}

async function run() {
  const models = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro",
    "gemini-pro-latest",
    "gemini-flash-latest",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite-preview-02-05"
  ];
  
  const results = [];
  for (const m of models) {
    console.log(`Testing ${m}...`);
    results.push(await testModel(m));
  }
  
  fs.writeFileSync("model_test_results.json", JSON.stringify(results, null, 2));
  process.exit(0);
}

run();
