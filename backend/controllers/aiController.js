const aiService = require("../utils/aiService");
const Resume = require("../models/Resume");
const puppeteer = require("puppeteer");
const User = require("../models/User");
const Job = require("../models/Job");
exports.generateResume = async (req, res, next) => {
    try {
        const { description } = req.body;
        const prompt = `
          Act as a professional resume writer. Based on the user's description, generate a complete ATS-optimized resume including personal details, summary, skills, experience, education, certifications, projects, languages, and interests. Make it professional, structured, and concise. Ensure the bullet points are impactful.
          User's Raw Description:
          "${description}"
          OUTPUT FORMAT:
          Return STRICT JSON with these exact sections and keys:
          {
            "fullName": "Extracted or generated name",
            "email": "Extracted email or empty",
            "phone": "Extracted phone or empty",
            "linkedin": "Extracted LinkedIn or empty",
            "github": "Extracted GitHub or empty",
            "location": "Extracted location or empty",
            "portfolio": "Extracted portfolio or empty",
            "summary": "Professional summary string based on the description",
            "experience": [{"company": "...", "role": "...", "period": "...", "description": "optimized bullet points"}],
            "education": [{"school": "...", "degree": "...", "period": "..."}],
            "certifications": [{"name": "...", "issuer": "...", "date": "..."}],
            "projects": [{"name": "...", "description": "refined description", "technologies": "...", "link": "..."}],
            "skills": ["keyword-optimized skill 1", "skill 2"],
            "languages": ["language 1", "language 2"],
            "interests": ["interest 1"]
          }
          NO MARKDOWN, NO EXPLANATIONS. ONLY JSON.
        `;
        const text = await aiService.generateContent(prompt, "resume", req.body);
        const data = aiService.cleanJSON(text);
        res.status(200).json({
            success: true,
            data,
        });
    } catch (err) {
        if (err.message.includes("Quota")) res.status(429);
        next(err);
    }
};
exports.optimizeResume = async (req, res, next) => {
    try {
        const { resumeData, jobDescription } = req.body;
        const prompt = `
          Tailor this resume specifically for the given job description. Match keywords, improve relevance, and enhance alignment with the job requirements while keeping it ATS-friendly.
          Resume Data:
          ${JSON.stringify(resumeData)}
          Job Description:
          ${jobDescription}
          OUTPUT FORMAT:
          Return STRICT JSON with these sections:
          {
            "summary": "tailored summary string",
            "experience": [{"company": "...", "role": "...", "period": "...", "desc": "tailored bullet points"}],
            "skills": ["tailored skills"],
            "projects": [{"name": "...", "description": "tailored description", "link": "..."}]
          }
          NO MARKDOWN, NO EXPLANATIONS. ONLY JSON.
        `;
        const text = await aiService.generateContent(prompt, "resume", resumeData);
        const data = aiService.cleanJSON(text);
        res.status(200).json({
            success: true,
            data,
        });
    } catch (err) {
        if (err.message.includes("Quota")) res.status(429);
        next(err);
    }
};
exports.saveResume = async (req, res, next) => {
    try {
        console.log('--- SAVE RESUME DEBUG ---');
        console.log('User ID:', req.user?.id);
        console.log('Request Body:', JSON.stringify(req.body, null, 2));
        req.body.user = req.user.id;
        const resume = await Resume.create(req.body);
        console.log('Resume Created Successfully:', resume._id);
        res.status(201).json({
            success: true,
            data: resume,
        });
    } catch (err) {
        console.error('SAVE RESUME ERROR:', err);
        next(err);
    }
};
exports.getUserResumes = async (req, res, next) => {
    try {
        console.log('--- GET RESUMES DEBUG ---');
        console.log('User ID:', req.user?.id);
        const resumes = await Resume.find({ user: req.user.id }).sort("-createdAt");
        console.log('Resumes Found:', resumes.length);
        res.status(200).json({
            success: true,
            count: resumes.length,
            data: resumes,
        });
    } catch (err) {
        console.error('GET RESUMES ERROR:', err);
        next(err);
    }
};
exports.getResumeById = async (req, res, next) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            res.status(404);
            throw new Error("Resume not found");
        }
        if (resume.user.toString() !== req.user.id && req.user.role !== "admin") {
            res.status(401);
            throw new Error("Not authorized to access this resume");
        }
        res.status(200).json({
            success: true,
            data: resume,
        });
    } catch (err) {
        next(err);
    }
};
exports.updateResume = async (req, res, next) => {
    try {
        let resume = await Resume.findById(req.params.id);
        if (!resume) {
            res.status(404);
            throw new Error("Resume not found");
        }
        if (resume.user.toString() !== req.user.id && req.user.role !== "admin") {
            res.status(401);
            throw new Error("Not authorized to update this resume");
        }
        resume = await Resume.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            success: true,
            data: resume,
        });
    } catch (err) {
        next(err);
    }
};
exports.deleteResume = async (req, res, next) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            res.status(404);
            throw new Error("Resume not found");
        }
        if (resume.user.toString() !== req.user.id && req.user.role !== "admin") {
            res.status(401);
            throw new Error("Not authorized to delete this resume");
        }
        await resume.deleteOne();
        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        next(err);
    }
};
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
            margin: { top: '48px', right: '48px', bottom: '48px', left: '48px' }
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
