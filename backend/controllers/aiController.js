const aiService = require("../utils/aiService");
const puppeteer = require("puppeteer");
const User = require("../models/User");
const Job = require("../models/Job");

// @desc    Generate a professional resume
// @route   POST /api/ai/generate-resume
// @access  Private
exports.generateResume = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        const prompt = `
      Create a sleek Markdown resume for:
      Name: ${user.name}
      Bio: ${user.bio}
      Skills: ${user.skills.join(", ")}
      Context: ${req.body.additionalInfo || "None"}
      
      Format: Clean Markdown with headers, bullet points, and high-impact language. No placeholders.
    `;

        const text = await aiService.generateContent(prompt, "resume");
        const cleanedText = aiService.cleanMarkdown(text);

        res.status(200).json({
            success: true,
            data: cleanedText,
        });
    } catch (err) {
        if (err.message.includes("Quota")) res.status(429);
        next(err);
    }
};

// @desc    Generate a tailored job proposal
// @route   POST /api/ai/generate-proposal
// @access  Private
exports.generateProposal = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const job = await Job.findById(req.body.jobId);

        if (!job) {
            res.status(404);
            throw new Error("Job not found");
        }

        const prompt = `
      Write a brief, professional job proposal for "${job.title}".
      Requirements: ${job.description.substring(0, 500)}
      Freelancer: ${user.name}, Skills: ${user.skills.join(", ")}, Bio: ${user.bio}
      
      Tone: Professional and enthusiastic. Match skills to needs. Return ONLY the proposal text.
    `;

        const text = await aiService.generateContent(prompt, "proposal");

        res.status(200).json({
            success: true,
            data: text,
        });
    } catch (err) {
        if (err.message.includes("Quota")) res.status(429);
        next(err);
    }
};

// @desc    Chatbot assistant for the platform
// @route   POST /api/ai/chatbot
// @access  Public
exports.chatbot = async (req, res, next) => {
    try {
        const { message, context } = req.body;

        const prompt = `
      You are the Jobsphere AI Assistant. 
      User: "${message}"
      Context: ${context || "Freelancing platform navigation."}
      
      Respond helpfully and concisely in Markdown.
    `;

        const text = await aiService.generateContent(prompt, "chatbot", message);

        res.status(200).json({
            success: true,
            data: text,
        });
    } catch (err) {
        if (err.message.includes("Quota")) res.status(429);
        next(err);
    }
};

// @desc    Recommend Mentorship/Micro-Internships
// @route   POST /api/ai/recommend-mentorship
// @access  Private
exports.recommendMentorship = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        const prompt = `
      Profile: ${user.name}, Role: ${user.role}, Skills: ${user.skills.join(", ")}
      Task: Recommend 3 specific skill gaps and corresponding mentorship/micro-internship ideas.
      Format: Strict JSON array of objects with keys: "skillGap", "mentorshipTopic", "microInternshipTask".
    `;

        const text = await aiService.generateContent(prompt, "mentorship");
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const recommendations = JSON.parse(cleanedText);

        res.status(200).json({
            success: true,
            data: recommendations,
        });
    } catch (err) {
        if (err.message.includes("Quota")) res.status(429);
        next(err);
    }
};

// @desc    Check AI Service Status
// @route   GET /api/ai/status
// @access  Public
exports.getAIStatus = async (req, res, next) => {
    try {
        const hasKey = !!process.env.GEMINI_API_KEY;
        res.status(200).json({
            success: true,
            status: hasKey ? "Online" : "Missing Configuration",
            provider: "Google Gemini",
            tier: "Free Tier (with fallbacks)"
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Export resume as PDF
// @route   POST /api/ai/export-pdf
// @access  Private
exports.exportResumePDF = async (req, res, next) => {
    try {
        const { html, styles, userName } = req.body;

        if (!html) {
            res.status(400);
            throw new Error("HTML content is required");
        }

        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();
        
        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    @page { size: A4; margin: 0; }
                    body { margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; font-family: sans-serif; }
                    ${styles || ""}
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;

        await page.setContent(fullHtml, { waitUntil: 'load' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
        });

        await browser.close();

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${userName || "Resume"}.pdf"`,
            "Content-Length": pdfBuffer.length,
        });

        res.status(200).send(pdfBuffer);
    } catch (err) {
        next(err);
    }
};
