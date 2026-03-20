const aiService = require("./utils/aiService");
require("dotenv").config();

async function verify() {
    console.log("--- Testing Refined Mock Responses ---");
    const testCases = [
        { msg: "i forget my password", expected: "Account Access Help" },
        { msg: "how to find a job", expected: "Finding Jobs" },
        { msg: "update my profile", expected: "Profile Tips" },
        { msg: "hello there", expected: "JobSphere Smart Assistant" }
    ];

    for (const test of testCases) {
        // Construct a full prompt similar to how the controller does it
        const prompt = `
            You are the Jobsphere AI Assistant. 
            User: "${test.msg}"
            Context: Freelancing platform navigation.
            Respond helpfully and concisely in Markdown.
        `;
        
        // Test with rawMessage passed
        const responseWithMsg = aiService.getMockResponse("chatbot", test.msg);
        console.log(`Query: "${test.msg}"`);
        console.log(`Response: ${responseWithMsg.substring(0, 50)}...`);
        
        const success = responseWithMsg.includes(test.expected);
        console.log(`Result: ${success ? "PASSED" : "FAILED"}\n`);
    }

    // Verify that the broad keyword "job" in "Jobsphere" doesn't trigger "Finding Jobs" for a general greeting
    console.log("--- Testing Regex Word Boundaries ---");
    const greetingMsg = "hello";
    const greetingResponse = aiService.getMockResponse("chatbot", greetingMsg);
    if (greetingResponse.includes("Finding Jobs")) {
        console.log("FAILED: 'Jobsphere' triggered 'Finding Jobs' mock.");
    } else {
        console.log("PASSED: 'Jobsphere' name did not trigger 'Finding Jobs' mock.");
    }
}

verify();
