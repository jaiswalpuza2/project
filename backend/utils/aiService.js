const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

/**
 * AI Service for JobSphere
 * Manages free-tier AI models with fallbacks and robust error handling.
 */
class AIService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.groqApiKey = process.env.GROQ_API_KEY;
        this.genAI = this.apiKey ? new GoogleGenerativeAI(this.apiKey) : null;
        this.isGeminiBroken = false;
        this.lastHealthCheck = 0;
        
        // Modern Gemini models
        this.models = [
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-pro",
        ];

        // Non-blocking health check
        this.checkAPIHealth();
    }

    async checkAPIHealth() {
        if (!this.genAI) return;
        
        // Prevent excessive checks (max once per minute)
        const now = Date.now();
        if (now - this.lastHealthCheck < 60000) return;
        this.lastHealthCheck = now;

        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            await model.generateContent("hi");
            this.isGeminiBroken = false;
        } catch (err) {
            console.error("AI Service: Gemini API check failed or rate-limited. Falling back.");
            this.isGeminiBroken = true;
        }
    }

    /**
     * Generic content generation with automatic model fallback
     */
    async generateContent(prompt, type = "general", rawMessage = "") {
        if (!this.genAI && !this.groqApiKey) {
            console.error("AI Service: No API Keys (Gemini/Groq) found.");
            return this.getMockResponse(type, rawMessage || prompt);
        }

        let lastError = null;

        try {
            // 1. Try Gemini Models first
            if (this.genAI && !this.isGeminiBroken) {
                for (const modelName of this.models) {
                    try {
                        const model = this.genAI.getGenerativeModel({ model: modelName });
                        const result = await model.generateContent(prompt);
                        const response = await result.response;
                        return response.text();
                    } catch (err) {
                        console.warn(`Gemini ${modelName} failed:`, err.message);
                        lastError = err;
                        // If it's a 429, we are rate limited, stop trying Gemini for now.
                        if (err.message.includes("429")) {
                            this.isGeminiBroken = true;
                            break;
                        }
                    }
                }
            }

            // 2. Try Groq Fallback
            if (this.groqApiKey) {
                try {
                    console.log("Switching to Groq fallback...");
                    const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
                        model: "llama-3.3-70b-versatile",
                        messages: [{ role: "user", content: prompt }]
                    }, {
                        headers: { "Authorization": `Bearer ${this.groqApiKey}` },
                        timeout: 10000
                    });
                    return response.data.choices[0].message.content;
                } catch (err) {
                    console.warn("Groq fallback failed:", err.message);
                    lastError = err;
                }
            }
        } catch (globalErr) {
            console.error("AI Service Global Exception:", globalErr.message);
            lastError = globalErr;
        }

        // 3. Last Resort: Adaptive Simulator Mode
        console.log("AI Service: Using Adaptive Simulator Mode.");
        return this.getMockResponse(type, rawMessage || prompt);
    }

    /**
     * Provides dynamic mock data for various AI features
     */
    getMockResponse(type, prompt = "") {
        const lowerPrompt = prompt.toLowerCase();
        const mocks = {
            resume: `# Professional Resume (Simulated)\n\n## Objective\nResults-driven professional seeking to leverage expertise in modern development workflows and AI integration.\n\n## Core Competencies\n- Full-Stack Development\n- AI System Architecture\n- Scalable Solutions\n\n[Note: This is a generated placeholder while we optimize high-load providers.]`,
            
            proposal: `Hi! I noticed your project and I'm confident my skills match your requirements. I have extensive experience in this field and can deliver high-quality results on time. Let's discuss further!`,
            
            chatbot: this.generateDynamicChatbotResponse(lowerPrompt),
            
            mentorship: JSON.stringify([
                { skillGap: "Advanced AI Ethics", mentorshipTopic: "Responsible AI Development", microInternshipTask: "Audit an AI model for bias." },
                { skillGap: "System Resilience", mentorshipTopic: "Gremlin & Chaos Engineering", microInternshipTask: "Run a fault-injection test on a dev cluster." }
            ]),
            
            general: `I am your helpful AI collaborator. I noticed your interest in "${prompt.substring(0, 30)}...". I'm currently in stability mode to ensure consistent assistance.`
        };
        return mocks[type] || mocks.general;
    }

    generateDynamicChatbotResponse(query) {
        // Precise keyword matching using regex to avoid false positives with names like "Jobsphere"
        if (/\b(?:password|reset|forgot|login|access)\b/i.test(query)) {
            return "### Account Access Help\nIf you've forgotten your password or can't log in:\n1. Go to the **Login** page.\n2. Click on **'Forgot Password?'**.\n3. Enter your registered email to receive a reset link.\n4. Check your inbox (and spam folder) for instructions.\n\nNeed more help? Contact our support team!";
        }
        
        if (/\b(?:job|find|search|work|opening)\b/i.test(query)) {
            return "### Finding Jobs\nYou can find your next opportunity easily:\n- Click on the **'Find Jobs'** tab in the navigation bar.\n- Use the search bar for specific titles like 'React Developer'.\n- Apply filters for salary, experience level, and job type (Remote/Full-time).\n- Save jobs you like to apply later!";
        }
        
        if (/\b(?:profile|bio|skills|account|detail)\b/i.test(query)) {
            return "### Profile Tips\nStand out to employers by:\n- Adding a professional **Bio** that highlights your unique value.\n- Listing all relevant **Skills** (e.g., JavaScript, Project Management).\n- Uploading a clear profile picture.\n- Keeping your experience and education history up to date!";
        }

        if (/\b(?:hello|hi|hey|greetings)\b/i.test(query)) {
            return "Hello! I'm the JobSphere Smart Assistant. I can help you find jobs, reset your password, or optimize your profile. What would you like to do first?";
        }

        if (/\b(?:help|how|support)\b/i.test(query)) {
            return "I'm here to help! You can ask me things like:\n- 'How do I find a job?'\n- 'I forgot my password'\n- 'How do I update my profile?'\n- 'Help me write a proposal'";
        }

        return "I understand you're asking about something specific. While I'm in stability mode, I can provide the best guidance on **Job Searches**, **Profile Building**, **Account Access**, and **General Navigation**. Could you clarify your request?";
    }

    /**
     * Formats AI responses by stripping markdown separators if needed
     */
    cleanMarkdown(text) {
        if (!text) return "";
        return text.toString().replace(/^\`\`\`markdown\n?/gi, '').replace(/^\`\`\`json\n?/gi, '').replace(/\`\`\`$/g, '').trim();
    }
}

module.exports = new AIService();
