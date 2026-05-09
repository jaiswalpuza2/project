const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

class AIService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.groqApiKey = process.env.GROQ_API_KEY;
        this.openRouterApiKey = process.env.OPENROUTER_API_KEY;
        this.genAI = this.apiKey ? new GoogleGenerativeAI(this.apiKey) : null;
        this.isGeminiBroken = false;
        this.lastHealthCheck = 0;
        this.models = [
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-2.0-flash-lite",
            "gemini-1.5-pro",
        ];

        if (this.genAI) {
            console.log("AI Service: Google Gemini initialized.");
            this.checkAPIHealth();
        } else if (this.openRouterApiKey) {
            console.log("AI Service: NVIDIA AI (via OpenRouter) initialized as primary service.");
        } else if (this.groqApiKey) {
            console.log("AI Service: Groq initialized as primary service.");
        } else {
            console.warn("AI Service: No API Keys (Gemini/Groq/OpenRouter) found. Running in Adaptive Simulator Mode.");
        }
    }

    async checkAPIHealth() {
        if (!this.genAI) return;

        const now = Date.now();
        if (now - this.lastHealthCheck < 60000) return;
        this.lastHealthCheck = now;

        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            await model.generateContent("hi");
            this.isGeminiBroken = false;
        } catch (err) {
            if (!this.openRouterApiKey) {
                console.error("AI Service: Gemini API check failed or rate-limited. Falling back.");
            } else {
                console.log("AI Service: using OpenRouter NVIDIA AI as primary service.");
            }
            this.isGeminiBroken = true;
        }
    }

    async generateContent(prompt, type = "general", rawMessage = "") {

        if (this.isGeminiBroken) {
            const now = Date.now();
            if (now - this.lastHealthCheck > 30000) {
                console.log("AI Service: Attempting auto-recovery check...");
                await this.checkAPIHealth();
            }
        }

        if (!this.genAI && !this.groqApiKey && !this.openRouterApiKey) {
            console.error("AI Service: No API Keys (Gemini/Groq/OpenRouter) found.");
            return this.getMockResponse(type, rawMessage || prompt);
        }

        let lastError = null;

        try {

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

                        if (err.message.includes("429")) {
                            this.isGeminiBroken = true;
                            break;
                        }
                    }
                }
            }

            if (this.groqApiKey) {
                try {
                    console.log("AI Service: Using Groq (Llama 3)...");
                    const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
                        model: "llama-3.3-70b-versatile",
                        messages: [{ role: "user", content: prompt }]
                    }, {
                        headers: { "Authorization": `Bearer ${this.groqApiKey}` },
                        timeout: 10000
                    });
                    return response.data.choices[0].message.content;
                } catch (err) {
                    console.warn("AI Service: Groq failed:", err.message);
                    lastError = err;
                }
            }

            if (this.openRouterApiKey) {
                try {
                    console.log("AI Service: Using OpenRouter fallback (NVIDIA)...");
                    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
                        model: "nvidia/nemotron-3-super-120b-a12b:free",
                        messages: [{ role: "user", content: prompt }]
                    }, {
                        headers: { 
                            "Authorization": `Bearer ${this.openRouterApiKey}`,
                            "Content-Type": "application/json"
                        },
                        timeout: 30000
                    });
                    if (response.data.error) {
                        throw new Error(response.data.error.message || response.data.error);
                    }
                    return response.data.choices[0].message.content;
                } catch (err) {
                    console.warn("AI Service: OpenRouter failed:", err.response?.data?.error?.message || err.message);
                    lastError = err;
                }
            }
        } catch (globalErr) {
            console.error("AI Service Global Exception:", globalErr.message);
            lastError = globalErr;
        }

        console.log("AI Service: Using Adaptive Simulator Mode.");
        return this.getMockResponse(type, rawMessage || prompt);
    }

    getMockResponse(type, prompt = "") {
        const lowerPrompt = typeof prompt === 'string' ? prompt.toLowerCase() : "";
        const rawData = typeof prompt === 'object' ? prompt : null;

        let desc = "";
        let extractedName = null;
        let extractedEmail = null;
        let extractedPhone = null;
        let extractedLocation = null;
        let extractedSkills = null;

        if (type === 'resume') {
            desc = rawData?.description || prompt || "A talented professional seeking new opportunities.";
            desc = String(desc);

            const nameMatch = desc.match(/(?:Name|Full Name):\s*([a-zA-Z\s]+)|(?:i am|my name is)\s+([a-zA-Z\s]+)/i);
            extractedName = nameMatch ? (nameMatch[1] || nameMatch[2]).trim().split('\n')[0] : (desc.toLowerCase().includes("puja") ? "Puja Jaiswal" : "Alex Developer");

            const emailMatch = desc.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            extractedEmail = emailMatch ? emailMatch[0] : (extractedName === "Puja Jaiswal" ? "puja@example.com" : "alex@example.com");

            const phoneMatch = desc.match(/(?:Phone|Contact|Mobile)(?:\s*Number)?:\s*([+0-9\s-]+)/i);
            extractedPhone = phoneMatch ? phoneMatch[1].trim().split('\n')[0] : "+1 234 567 8900";

            const locationMatch = desc.match(/(?:Location|Address|City):\s*([a-zA-Z\s,]+)/i);
            extractedLocation = locationMatch ? locationMatch[1].trim().split('\n')[0] : "Global / Remote";

            const skillsMatch = desc.match(/(?:skills:|skilled in|experience with|using) (.*?)(?:\.|and|\n\n)/i);
            if (skillsMatch) {
                extractedSkills = skillsMatch[1].split(/,|\n|-/).map(s => s.trim()).filter(s => s.length > 0 && s.length < 30);
            } else {
                extractedSkills = extractedName === "Puja Jaiswal" ? ["React", "Node.js", "MongoDB", "Tailwind CSS", "AWS"] : ["JavaScript", "React", "Node.js"];
            }
        }

        const mocks = {
            resume: JSON.stringify({
                fullName: extractedName,
                email: extractedEmail,
                phone: extractedPhone,
                linkedin: `linkedin.com/in/${extractedName?.replace(/\s+/g, '-').toLowerCase()}`,
                github: `github.com/${extractedName?.replace(/\s+/g, '-').toLowerCase()}`,
                location: extractedLocation,
                portfolio: `${extractedName?.replace(/\s+/g, '').toLowerCase()}.dev`,
                summary: desc.length > 200 ? desc.substring(0, 200) + "..." : desc,
                experience: [
                    { company: "Mock Company A", role: "Software Engineer", period: "2021 - Present", description: "Built scalable applications and contributed to full-stack development." },
                    { company: "Mock Company B", role: "Junior Developer", period: "2019 - 2021", description: "Assisted in front-end revamps and API integrations." }
                ],
                education: [{ school: "Mock University", degree: "B.Sc. Computer Science", period: "2015 - 2019" }],
                skills: extractedSkills,
                projects: [{ name: "Mock Project", description: "A great demonstration of my skills.", technologies: extractedSkills?.join(", "), link: "" }],
                certifications: [{ name: "Mock Certification", issuer: "Mock Org", date: "2022" }],
                languages: ["English"],
                interests: ["Technology", "Coding"]
            }),

            proposal: `Hi! I noticed your project and I'm confident my skills match your requirements. I have extensive experience in this field and can deliver high-quality results on time. Let's discuss further!`,

            chatbot: this.generateDynamicChatbotResponse(lowerPrompt),

            mentorship: JSON.stringify([
                { skillGap: "Advanced AI Ethics", mentorshipTopic: "Responsible AI Development", microInternshipTask: "Audit an AI model for bias." },
                { skillGap: "System Resilience", mentorshipTopic: "Gremlin & Chaos Engineering", microInternshipTask: "Run a fault-injection test on a dev cluster." }
            ]),

            general: `I am your helpful AI collaborator. I noticed your interest in "${typeof prompt === 'string' ? prompt.substring(0, 30) : "this topic"}...". I'm currently in stability mode to ensure consistent assistance.`
        };
        return mocks[type] || mocks.general;
    }

    generateDynamicChatbotResponse(query) {

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

    cleanMarkdown(text) {
        if (!text) return "";
        return text.toString()
            .replace(/^```(markdown|json)?\n?/gi, '')
            .replace(/```$/g, '')
            .trim();
    }

    cleanJSON(text) {
        if (!text) return null;
        try {
            const cleaned = this.cleanMarkdown(text);
            return JSON.parse(cleaned);
        } catch (err) {
            console.error("AI Service: JSON Parsing failed", err.message);

            const matches = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
            if (matches) {
                try {
                    return JSON.parse(matches[0]);
                } catch (e) {
                    return text; 
                }
            }
            return text; 
        }
    }
}

module.exports = new AIService();
