import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  Layout,
  FileDown,
  Loader2,
  Plus,
  Trash2,
  ChevronLeft,
  Download,
  Edit3,
  RefreshCw,
  Send,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Heart,
  Code,
  Linkedin,
  Github,
  FileText
} from "lucide-react";

const ResumeGenerator = () => {
  const { token, user } = useAuth();
  const [currentStep, setCurrentStep] = useState("hero"); // hero, input, form, preview
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState("classic");
  const [pageMode, setPageMode] = useState("auto"); // auto, compact, spacious

  const pageModeStyles = {
    "auto": {
      pdfSectionMb: 24,
      pdfHeadingMb: 12,
      pdfHeadingSize: "14px",
      pdfTextSize: "13px",
      pdfItemMb: 16,
      pdfLineHeight: 1.6,
      pdfTitleSize: "36px",
      pdfTitleMb: 12,
      reactContainer: "space-y-10",
      reactSectionMb: "mb-6",
      reactTitle: "text-4xl md:text-5xl",
      reactText: "text-sm",
      reactInfoDesc: "text-sm mt-1",
      reactInfoRole: "font-bold text-gray-900 dark:text-gray-900",
      pdfPillPadding: "4px 12px",
      pdfPillSize: "12px",
      reactPillPadding: "px-4 py-1.5"
    },
    "compact": {
      pdfSectionMb: 12,
      pdfHeadingMb: 6,
      pdfHeadingSize: "12px",
      pdfTextSize: "11px",
      pdfItemMb: 8,
      pdfLineHeight: 1.4,
      pdfTitleSize: "28px",
      pdfTitleMb: 6,
      reactContainer: "space-y-6",
      reactSectionMb: "mb-3",
      reactTitle: "text-3xl md:text-4xl",
      reactText: "text-xs",
      reactInfoDesc: "text-xs mt-1",
      reactInfoRole: "font-bold text-gray-900 dark:text-gray-900 text-sm",
      pdfPillPadding: "2px 8px",
      pdfPillSize: "10px",
      reactPillPadding: "px-3 py-1"
    },
    "spacious": {
      pdfSectionMb: 36,
      pdfHeadingMb: 16,
      pdfHeadingSize: "16px",
      pdfTextSize: "14px",
      pdfItemMb: 24,
      pdfLineHeight: 1.8,
      pdfTitleSize: "42px",
      pdfTitleMb: 16,
      reactContainer: "space-y-14",
      reactSectionMb: "mb-8",
      reactTitle: "text-5xl md:text-6xl",
      reactText: "text-base",
      reactInfoDesc: "text-base mt-2",
      reactInfoRole: "font-bold text-gray-900 dark:text-gray-900 text-lg",
      pdfPillPadding: "6px 16px",
      pdfPillSize: "13px",
      reactPillPadding: "px-5 py-2"
    }
  };

  const themes = {
    classic: {
      name: "Classic Blue",
      bg: "bg-blue-600",
      text: "text-blue-600",
      border: "border-blue-600",
      heading: "text-blue-800",
      link: "text-blue-500",
      pill: "bg-blue-50 text-blue-700 border-blue-100",
      pdfHex: "#2563eb",
      pdfText: "#2563eb",
      pdfHeading: "#1e40af",
      pdfPillBg: "#eff6ff",
      pdfPillText: "#1d4ed8",
      pdfPillBorder: "#dbeafe"
    },
    modern: {
      name: "Modern Purple",
      bg: "bg-purple-600",
      text: "text-purple-600",
      border: "border-purple-600",
      heading: "text-purple-800",
      link: "text-purple-500",
      pill: "bg-purple-50 text-purple-700 border-purple-100",
      pdfHex: "#9333ea",
      pdfText: "#9333ea",
      pdfHeading: "#6b21a8",
      pdfPillBg: "#faf5ff",
      pdfPillText: "#7e22ce",
      pdfPillBorder: "#f3e8ff"
    },
    minimal: {
      name: "Minimal Dark",
      bg: "bg-gray-900",
      text: "text-gray-900",
      border: "border-gray-900",
      heading: "text-gray-900",
      link: "text-blue-600",
      pill: "bg-gray-100 text-gray-800 border-gray-200",
      pdfHex: "#111827",
      pdfText: "#2563eb",
      pdfHeading: "#111827",
      pdfPillBg: "#f3f4f6",
      pdfPillText: "#1f2937",
      pdfPillBorder: "#e5e7eb"
    },
    elegant: {
      name: "Elegant Green",
      bg: "bg-emerald-600",
      text: "text-emerald-600",
      border: "border-emerald-600",
      heading: "text-emerald-800",
      link: "text-emerald-500",
      pill: "bg-emerald-50 text-emerald-700 border-emerald-100",
      pdfHex: "#059669",
      pdfText: "#059669",
      pdfHeading: "#065f46",
      pdfPillBg: "#ecfdf5",
      pdfPillText: "#047857",
      pdfPillBorder: "#d1fae5"
    },
    soft: {
      name: "Soft Gray",
      bg: "bg-slate-500",
      text: "text-slate-600",
      border: "border-slate-300",
      heading: "text-slate-700",
      link: "text-slate-400",
      pill: "bg-slate-50 text-slate-700 border-slate-200",
      pdfHex: "#cbd5e1",
      pdfText: "#64748b",
      pdfHeading: "#334155",
      pdfPillBg: "#f8fafc",
      pdfPillText: "#334155",
      pdfPillBorder: "#e2e8f0"
    }
  };

  const [resumeData, setResumeData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    location: "",
    portfolio: "",
    summary: "",
    skills: [""],
    experience: [{ company: "", role: "", period: "", description: "" }],
    education: [{ school: "", degree: "", period: "" }],
    certifications: [{ name: "", issuer: "", date: "" }],
    projects: [{ name: "", description: "", technologies: "", link: "" }],
    languages: [""],
    interests: [""],
  });

  const handleGenerate = async () => {
    if (!description.trim()) return toast.warning("Please enter a description about yourself.");

    setResumeData({
      fullName: "", email: "", phone: "", linkedin: "", github: "",
      location: "", portfolio: "", summary: "", skills: [""],
      experience: [{ company: "", role: "", period: "", description: "" }],
      education: [{ school: "", degree: "", period: "" }],
      certifications: [{ name: "", issuer: "", date: "" }],
      projects: [{ name: "", description: "", technologies: "", link: "" }],
      languages: [""], interests: [""],
    });

    setLoading(true);
    console.log("Starting new resume generation...");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/generate-resume",
        { description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        const ai = res.data.data;
        console.log("New AI Response Received:", ai);

        setResumeData({
          fullName: ai.fullName || user?.name || "",
          email: ai.email || "",
          phone: ai.phone || "",
          linkedin: ai.linkedin || "",
          github: ai.github || "",
          location: ai.location || "",
          portfolio: ai.portfolio || "",
          summary: ai.summary || "",
          skills: Array.isArray(ai.skills) && ai.skills.length > 0 ? ai.skills : [""],
          experience: Array.isArray(ai.experience) && ai.experience.length > 0 
            ? ai.experience.map(e => ({ company: e.company || "", role: e.role || "", period: e.period || "", description: e.description || e.desc || "" })) 
            : [{ company: "", role: "", period: "", description: "" }],
          education: Array.isArray(ai.education) && ai.education.length > 0 
            ? ai.education.map(e => ({ school: e.school || "", degree: e.degree || "", period: e.period || "" })) 
            : [{ school: "", degree: "", period: "" }],
          certifications: Array.isArray(ai.certifications) && ai.certifications.length > 0 
            ? ai.certifications.map(c => ({ name: c.name || "", issuer: c.issuer || "", date: c.date || "" })) 
            : [{ name: "", issuer: "", date: "" }],
          projects: Array.isArray(ai.projects) && ai.projects.length > 0 
            ? ai.projects.map(p => ({ name: p.name || "", description: p.description || p.desc || "", technologies: p.technologies || "", link: p.link || "" })) 
            : [{ name: "", description: "", technologies: "", link: "" }],
          languages: Array.isArray(ai.languages) && ai.languages.length > 0 ? ai.languages : [""],
          interests: Array.isArray(ai.interests) && ai.interests.length > 0 ? ai.interests : [""],
        });
        setCurrentStep("form");
        toast.success("AI generated your resume! Review and edit below.");
      }
    } catch (error) {
      console.error("Resume generation error:", error);
      toast.error("Failed to generate resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setResumeData({ ...resumeData, [field]: value });
  };

  const handleArrayItemChange = (section, index, field, value) => {
    const updated = [...resumeData[section]];
    if (typeof updated[index] === "string") {
      updated[index] = value;
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setResumeData({ ...resumeData, [section]: updated });
  };

  const handleAddItem = (section) => {
    const templates = {
      skills: "",
      experience: { company: "", role: "", period: "", description: "" },
      education: { school: "", degree: "", period: "" },
      certifications: { name: "", issuer: "", date: "" },
      projects: { name: "", description: "", technologies: "", link: "" },
      languages: "",
      interests: "",
    };
    setResumeData({ ...resumeData, [section]: [...resumeData[section], templates[section]] });
  };

  const handleRemoveItem = (section, index) => {
    const updated = [...resumeData[section]];
    updated.splice(index, 1);
    setResumeData({ ...resumeData, [section]: updated });
  };

  const handleExportPDF = async (action = 'download') => {
    setLoading(true);
    try {
      const activeTheme = themes[theme];
      const activeMode = pageModeStyles[pageMode];

      const resumeHtml = `
        <div style="color: #1a1a1a; max-width: 800px; margin: auto; font-family: 'Segoe UI', Arial, sans-serif;">
          <div style="border-bottom: 3px solid ${activeTheme.pdfHex}; padding-bottom: ${activeMode.pdfSectionMb}px; margin-bottom: ${activeMode.pdfSectionMb + 8}px; text-align: center; page-break-inside: avoid;">
            <h1 style="font-size: ${activeMode.pdfTitleSize}; margin: 0 0 ${activeMode.pdfTitleMb}px 0; color: #111; letter-spacing: -0.5px;">${resumeData.fullName}</h1>
            <div style="font-size: ${activeMode.pdfTextSize}; color: #6b7280; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 16px; margin-top: 8px;">
              ${resumeData.email ? `<span style="display: flex; align-items: center; gap: 4px;">✉ ${resumeData.email}</span>` : ""}
              ${resumeData.phone ? `<span style="display: flex; align-items: center; gap: 4px;">📞 ${resumeData.phone}</span>` : ""}
              ${resumeData.location ? `<span style="display: flex; align-items: center; gap: 4px;">📍 ${resumeData.location}</span>` : ""}
              ${resumeData.linkedin ? `<span style="display: flex; align-items: center; gap: 4px; color: ${activeTheme.pdfText};">LinkedIn: ${resumeData.linkedin}</span>` : ""}
              ${resumeData.github ? `<span style="display: flex; align-items: center; gap: 4px; color: ${activeTheme.pdfText};">GitHub: ${resumeData.github}</span>` : ""}
              ${resumeData.portfolio ? `<span style="display: flex; align-items: center; gap: 4px; color: ${activeTheme.pdfText};">🌐 ${resumeData.portfolio}</span>` : ""}
            </div>
          </div>

          ${resumeData.summary ? `
          <div style="margin-bottom: ${activeMode.pdfSectionMb}px; page-break-inside: avoid;">
            <h3 style="font-size: ${activeMode.pdfHeadingSize}; text-transform: uppercase; letter-spacing: 2px; color: ${activeTheme.pdfHeading}; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: ${activeMode.pdfHeadingMb}px; font-weight: 800; page-break-after: avoid;">Professional Summary</h3>
            <p style="font-size: ${activeMode.pdfTextSize}; line-height: ${activeMode.pdfLineHeight}; color: #4b5563;">${resumeData.summary}</p>
          </div>` : ""}

          ${resumeData.skills?.filter(s => s).length > 0 ? `
          <div style="margin-bottom: ${activeMode.pdfSectionMb}px; page-break-inside: avoid;">
            <h3 style="font-size: ${activeMode.pdfHeadingSize}; text-transform: uppercase; letter-spacing: 2px; color: ${activeTheme.pdfHeading}; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: ${activeMode.pdfHeadingMb}px; font-weight: 800; page-break-after: avoid;">Skills</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${resumeData.skills.filter(s => s).map(s => `<span style="padding: ${activeMode.pdfPillPadding}; background: ${activeTheme.pdfPillBg}; color: ${activeTheme.pdfPillText}; border: 1px solid ${activeTheme.pdfPillBorder}; border-radius: 6px; font-size: ${activeMode.pdfPillSize}; font-weight: bold;">${s}</span>`).join("")}
            </div>
          </div>` : ""}

          ${resumeData.experience?.filter(e => e.company).length > 0 ? `
          <div style="margin-bottom: ${activeMode.pdfSectionMb}px;">
            <h3 style="font-size: ${activeMode.pdfHeadingSize}; text-transform: uppercase; letter-spacing: 2px; color: ${activeTheme.pdfHeading}; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: ${activeMode.pdfHeadingMb}px; font-weight: 800; page-break-after: avoid;">Work Experience</h3>
            ${resumeData.experience.filter(e => e.company).map(exp => `
              <div style="margin-bottom: ${activeMode.pdfItemMb}px; page-break-inside: avoid;">
                <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: ${activeMode.pdfTextSize}; color: #111;">
                  <span>${exp.role} <span style="color: #6b7280; font-weight: normal;">— ${exp.company}</span></span>
                  <span style="color: #9ca3af; font-size: ${activeMode.pdfTextSize}; opacity: 0.8;">${exp.period}</span>
                </div>
                <p style="font-size: ${activeMode.pdfTextSize}; color: #4b5563; margin-top: 6px; white-space: pre-line; line-height: ${activeMode.pdfLineHeight};">${exp.description}</p>
              </div>
            `).join("")}
          </div>` : ""}

          ${resumeData.education?.filter(e => e.school).length > 0 ? `
          <div style="margin-bottom: ${activeMode.pdfSectionMb}px;">
            <h3 style="font-size: ${activeMode.pdfHeadingSize}; text-transform: uppercase; letter-spacing: 2px; color: ${activeTheme.pdfHeading}; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: ${activeMode.pdfHeadingMb}px; font-weight: 800; page-break-after: avoid;">Education</h3>
            ${resumeData.education.filter(e => e.school).map(edu => `
              <div style="margin-bottom: ${activeMode.pdfItemMb}px; page-break-inside: avoid;">
                <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: ${activeMode.pdfTextSize}; color: #111;">
                  <span>${edu.degree}</span>
                  <span style="color: #9ca3af; font-size: ${activeMode.pdfTextSize}; opacity: 0.8;">${edu.period}</span>
                </div>
                <div style="font-size: ${activeMode.pdfTextSize}; color: #6b7280; margin-top: 4px;">${edu.school}</div>
              </div>
            `).join("")}
          </div>` : ""}

          ${resumeData.projects?.filter(p => p.name).length > 0 ? `
          <div style="margin-bottom: ${activeMode.pdfSectionMb}px;">
            <h3 style="font-size: ${activeMode.pdfHeadingSize}; text-transform: uppercase; letter-spacing: 2px; color: ${activeTheme.pdfHeading}; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: ${activeMode.pdfHeadingMb}px; font-weight: 800; page-break-after: avoid;">Projects</h3>
            ${resumeData.projects.filter(p => p.name).map(proj => `
              <div style="margin-bottom: ${activeMode.pdfItemMb}px; page-break-inside: avoid;">
                <div style="font-weight: 700; font-size: ${activeMode.pdfTextSize}; color: #111;">${proj.name} ${proj.link ? `<span style="color: ${activeTheme.pdfText}; font-weight: normal; margin-left: 8px;">(${proj.link})</span>` : ""}</div>
                <div style="font-size: ${activeMode.pdfTextSize}; color: #4b5563; margin-top: 4px;">${proj.description}</div>
                ${proj.technologies ? `<div style="font-size: ${activeMode.pdfTextSize}; color: #9ca3af; margin-top: 4px; opacity: 0.8;">Tech: ${proj.technologies}</div>` : ""}
              </div>
            `).join("")}
          </div>` : ""}

          ${resumeData.certifications?.filter(c => c.name).length > 0 ? `
          <div style="margin-bottom: ${activeMode.pdfSectionMb}px;">
            <h3 style="font-size: ${activeMode.pdfHeadingSize}; text-transform: uppercase; letter-spacing: 2px; color: ${activeTheme.pdfHeading}; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: ${activeMode.pdfHeadingMb}px; font-weight: 800; page-break-after: avoid;">Certifications</h3>
            ${resumeData.certifications.filter(c => c.name).map(cert => `
              <div style="margin-bottom: 8px; font-size: ${activeMode.pdfTextSize}; color: #111; page-break-inside: avoid;">
                <strong>${cert.name}</strong> <span style="color: #6b7280;">— ${cert.issuer}</span> ${cert.date ? `<span style="color: #9ca3af;">(${cert.date})</span>` : ""}
              </div>
            `).join("")}
          </div>` : ""}

          ${resumeData.languages?.filter(l => l).length > 0 ? `
          <div style="margin-bottom: ${activeMode.pdfSectionMb}px; page-break-inside: avoid;">
            <h3 style="font-size: ${activeMode.pdfHeadingSize}; text-transform: uppercase; letter-spacing: 2px; color: ${activeTheme.pdfHeading}; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: ${activeMode.pdfHeadingMb}px; font-weight: 800; page-break-after: avoid;">Languages</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${resumeData.languages.filter(l => l).map(l => `<span style="padding: ${activeMode.pdfPillPadding}; background: ${activeTheme.pdfPillBg}; color: ${activeTheme.pdfPillText}; border: 1px solid ${activeTheme.pdfPillBorder}; border-radius: 6px; font-size: ${activeMode.pdfPillSize}; font-weight: bold;">${l}</span>`).join("")}
            </div>
          </div>` : ""}

          ${resumeData.interests?.filter(i => i).length > 0 ? `
          <div style="margin-bottom: ${activeMode.pdfSectionMb}px; page-break-inside: avoid;">
            <h3 style="font-size: ${activeMode.pdfHeadingSize}; text-transform: uppercase; letter-spacing: 2px; color: ${activeTheme.pdfHeading}; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: ${activeMode.pdfHeadingMb}px; font-weight: 800; page-break-after: avoid;">Interests</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${resumeData.interests.filter(i => i).map(i => `<span style="padding: ${activeMode.pdfPillPadding}; background: ${activeTheme.pdfPillBg}; color: ${activeTheme.pdfPillText}; border: 1px solid ${activeTheme.pdfPillBorder}; border-radius: 6px; font-size: ${activeMode.pdfPillSize}; font-weight: bold;">${i}</span>`).join("")}
            </div>
          </div>` : ""}
        </div>
      `;

      const res = await axios.post(
        "http://localhost:5000/api/ai/export-pdf",
        { html: resumeHtml, userName: resumeData.fullName },
        { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      if (action === 'preview') {
        window.open(url, "_blank");
        toast.success("Resume preview opened!");
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${resumeData.fullName.replace(/\s+/g, "_")}_Resume.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Resume downloaded!");
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
      }
    } catch (error) {
      console.error("PDF export failed:", error);
      toast.error("Failed to export PDF.");
    } finally {
      setLoading(false);
    }
  };

  const renderHero = () => (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>
      <div className="relative z-10 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-6xl md:text-8xl font-black text-slate-200 leading-[0.9] mb-8 tracking-tighter">
          Build a resume that <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400">gets you hired.</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          Leverage the power of AI to craft a professional, ATS-optimized resume in minutes. Pre-filled with your profile, polished by intelligence.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setCurrentStep("input")}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-2xl font-black text-lg hover:brightness-110 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-2xl shadow-indigo-500/20"
          >
            <Sparkles size={20} className="text-cyan-400 group-hover:rotate-12 transition-transform" />
            Start Building
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="mt-20 flex flex-wrap justify-center gap-8 text-slate-400 opacity-70 hover:opacity-100 transition-all duration-500">
          <div className="flex items-center gap-2 text-sm font-bold"><CheckCircle size={16} className="text-cyan-400" /> ATS Optimized</div>
          <div className="flex items-center gap-2 text-sm font-bold"><Sparkles size={16} className="text-indigo-400" /> AI Writing</div>
          <div className="flex items-center gap-2 text-sm font-bold"><Layout size={16} className="text-violet-400" /> Modern Layouts</div>
          <div className="flex items-center gap-2 text-sm font-bold"><FileDown size={16} className="text-emerald-400" /> PDF Export</div>
        </div>
      </div>
    </div>
  );

  const renderInput = () => (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-[#1E293B] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] rounded-[3rem] p-10 md:p-14 border border-slate-600/50 animate-in fade-in zoom-in-95 duration-500 relative">
        <button onClick={() => setCurrentStep("hero")} className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 mb-10 font-black uppercase tracking-widest text-[10px] transition-colors">
          <ChevronLeft size={16} /> Go Back
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center text-white">
            <FileText size={20} />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">AI Resume Description Input</h2>
        </div>
        <p className="text-slate-400 font-medium mb-8 text-sm">
          Enter a detailed description about yourself to generate your professional resume.
        </p>

        <textarea
          rows={10}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Type your description here…&#10;&#10;Example: I am Puja Jaiswal, a full-stack developer with 3 years of experience in React..."
          className="w-full bg-[#0F172A] border border-slate-600/50 rounded-3xl px-8 py-6 text-[#E2E8F0] font-medium placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none transition-all resize-none mb-10 text-sm leading-relaxed shadow-inner"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-2xl font-black text-lg hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-indigo-500/20 disabled:opacity-50 disabled:scale-100"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={22} />
              Generating Resume...
            </>
          ) : (
            <>
              <Sparkles size={22} />
              Generate Resume
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderForm = () => {
    const inputClass = "w-full px-6 py-4 bg-[#0F172A] border border-slate-600/50 rounded-2xl focus:border-indigo-500/50 transition-all font-bold outline-none text-sm shadow-inner text-[#E2E8F0] placeholder:text-slate-600";
    const labelClass = "block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1";
    const sectionClass = "bg-[#1E293B] border border-slate-600/50 rounded-[2.5rem] p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] hover:border-slate-500/50 transition-all duration-500";

    return (
      <div className="max-w-5xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button onClick={() => setCurrentStep("input")} className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 mb-6 font-bold text-sm transition-colors">
          <ChevronLeft size={16} /> Back to Input
        </button>
        <h2 className="text-4xl font-black text-slate-200 tracking-tight mb-2">Edit Your Resume</h2>
        <p className="text-slate-400 font-medium mb-10">Review and edit the AI-generated content below. All fields are editable.</p>

        <div className={`${sectionClass} mb-8`}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400"><User size={20} /></div>
            <h3 className="text-xl font-black text-slate-200">Personal Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className={labelClass}>Full Name</label><input className={inputClass} value={resumeData.fullName} onChange={(e) => handleFieldChange("fullName", e.target.value)} /></div>
            <div><label className={labelClass}>Email</label><input className={inputClass} value={resumeData.email} onChange={(e) => handleFieldChange("email", e.target.value)} /></div>
            <div><label className={labelClass}>Phone</label><input className={inputClass} value={resumeData.phone} onChange={(e) => handleFieldChange("phone", e.target.value)} /></div>
            <div><label className={labelClass}>Location</label><input className={inputClass} value={resumeData.location} onChange={(e) => handleFieldChange("location", e.target.value)} /></div>
            <div><label className={labelClass}>LinkedIn</label><input className={inputClass} value={resumeData.linkedin} onChange={(e) => handleFieldChange("linkedin", e.target.value)} /></div>
            <div><label className={labelClass}>GitHub</label><input className={inputClass} value={resumeData.github} onChange={(e) => handleFieldChange("github", e.target.value)} /></div>
            <div className="md:col-span-2"><label className={labelClass}>Portfolio URL</label><input className={inputClass} value={resumeData.portfolio} onChange={(e) => handleFieldChange("portfolio", e.target.value)} /></div>
          </div>
        </div>

        <div className={`${sectionClass} mb-8`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400"><FileText size={20} /></div>
            <h3 className="text-xl font-black text-slate-200">Professional Summary</h3>
          </div>
          <textarea rows={4} className={`${inputClass} resize-none`} value={resumeData.summary} onChange={(e) => handleFieldChange("summary", e.target.value)} />
        </div>

        <div className={`${sectionClass} mb-8`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400"><Code size={20} /></div>
              <h3 className="text-xl font-black text-slate-200">Skills</h3>
            </div>
            <button onClick={() => handleAddItem("skills")} className="flex items-center gap-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-xs transition-all text-slate-300"><Plus size={14} /> Add</button>
          </div>
          <div className="flex flex-wrap gap-3">
            {resumeData.skills.map((skill, idx) => (
              <div key={idx} className="relative group">
                <input className="px-4 py-2 bg-[#0F172A] border-2 border-transparent rounded-xl focus:border-indigo-500 transition-all font-bold outline-none text-sm min-w-[120px] text-slate-200" value={skill} onChange={(e) => handleArrayItemChange("skills", idx, null, e.target.value)} />
                <button onClick={() => handleRemoveItem("skills", idx)} className="absolute -top-1 -right-1 p-1 bg-red-500/20 text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={10} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className={`${sectionClass} mb-8`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400"><Briefcase size={20} /></div>
              <h3 className="text-xl font-black text-slate-200">Work Experience</h3>
            </div>
            <button onClick={() => handleAddItem("experience")} className="flex items-center gap-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-xs transition-all text-slate-300"><Plus size={14} /> Add</button>
          </div>
          {resumeData.experience.map((exp, idx) => (
            <div key={idx} className="relative mb-6 pb-6 border-b border-slate-600 last:border-0 last:pb-0 last:mb-0">
              <button onClick={() => handleRemoveItem("experience", idx)} className="absolute top-0 right-0 p-2 text-slate-400 hover:text-red-400 rounded-lg transition-all"><Trash2 size={16} /></button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <input placeholder="Company" className={inputClass} value={exp.company} onChange={(e) => handleArrayItemChange("experience", idx, "company", e.target.value)} />
                <input placeholder="Role" className={inputClass} value={exp.role} onChange={(e) => handleArrayItemChange("experience", idx, "role", e.target.value)} />
              </div>
              <input placeholder="Period (e.g. 2021 - Present)" className={`${inputClass} mb-3`} value={exp.period} onChange={(e) => handleArrayItemChange("experience", idx, "period", e.target.value)} />
              <textarea placeholder="Description" rows={3} className={`${inputClass} resize-none`} value={exp.description} onChange={(e) => handleArrayItemChange("experience", idx, "description", e.target.value)} />
            </div>
          ))}
        </div>

        <div className={`${sectionClass} mb-8`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center text-violet-400"><GraduationCap size={20} /></div>
              <h3 className="text-xl font-black text-slate-200">Education</h3>
            </div>
            <button onClick={() => handleAddItem("education")} className="flex items-center gap-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-xs transition-all text-slate-300"><Plus size={14} /> Add</button>
          </div>
          {resumeData.education.map((edu, idx) => (
            <div key={idx} className="relative mb-6 pb-6 border-b border-slate-600 last:border-0 last:pb-0 last:mb-0">
              <button onClick={() => handleRemoveItem("education", idx)} className="absolute top-0 right-0 p-2 text-slate-400 hover:text-red-400 rounded-lg transition-all"><Trash2 size={16} /></button>
              <input placeholder="School/University" className={`${inputClass} mb-3`} value={edu.school} onChange={(e) => handleArrayItemChange("education", idx, "school", e.target.value)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Degree" className={inputClass} value={edu.degree} onChange={(e) => handleArrayItemChange("education", idx, "degree", e.target.value)} />
                <input placeholder="Period" className={inputClass} value={edu.period} onChange={(e) => handleArrayItemChange("education", idx, "period", e.target.value)} />
              </div>
            </div>
          ))}
        </div>

        <div className={`${sectionClass} mb-8`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400"><Code size={20} /></div>
              <h3 className="text-xl font-black text-slate-200">Projects</h3>
            </div>
            <button onClick={() => handleAddItem("projects")} className="flex items-center gap-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-xs transition-all text-slate-300"><Plus size={14} /> Add</button>
          </div>
          {resumeData.projects.map((proj, idx) => (
            <div key={idx} className="relative mb-6 pb-6 border-b border-slate-600 last:border-0 last:pb-0 last:mb-0">
              <button onClick={() => handleRemoveItem("projects", idx)} className="absolute top-0 right-0 p-2 text-slate-400 hover:text-red-400 rounded-lg transition-all"><Trash2 size={16} /></button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <input placeholder="Project Name" className={inputClass} value={proj.name} onChange={(e) => handleArrayItemChange("projects", idx, "name", e.target.value)} />
                <input placeholder="Link (optional)" className={inputClass} value={proj.link} onChange={(e) => handleArrayItemChange("projects", idx, "link", e.target.value)} />
              </div>
              <input placeholder="Technologies used" className={`${inputClass} mb-3`} value={proj.technologies} onChange={(e) => handleArrayItemChange("projects", idx, "technologies", e.target.value)} />
              <textarea placeholder="Description" rows={3} className={`${inputClass} resize-none`} value={proj.description} onChange={(e) => handleArrayItemChange("projects", idx, "description", e.target.value)} />
            </div>
          ))}
        </div>

        <div className={`${sectionClass} mb-8`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-400"><Award size={20} /></div>
              <h3 className="text-xl font-black text-slate-200">Certifications</h3>
            </div>
            <button onClick={() => handleAddItem("certifications")} className="flex items-center gap-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-xs transition-all text-slate-300"><Plus size={14} /> Add</button>
          </div>
          {resumeData.certifications.map((cert, idx) => (
            <div key={idx} className="relative mb-6 pb-6 border-b border-slate-600 last:border-0 last:pb-0 last:mb-0">
              <button onClick={() => handleRemoveItem("certifications", idx)} className="absolute top-0 right-0 p-2 text-slate-400 hover:text-red-400 rounded-lg transition-all"><Trash2 size={16} /></button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input placeholder="Certificate Name" className={inputClass} value={cert.name} onChange={(e) => handleArrayItemChange("certifications", idx, "name", e.target.value)} />
                <input placeholder="Issuer" className={inputClass} value={cert.issuer} onChange={(e) => handleArrayItemChange("certifications", idx, "issuer", e.target.value)} />
                <input placeholder="Date" className={inputClass} value={cert.date} onChange={(e) => handleArrayItemChange("certifications", idx, "date", e.target.value)} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className={sectionClass}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400"><Languages size={20} /></div>
                <h3 className="text-xl font-black text-slate-200">Languages</h3>
              </div>
              <button onClick={() => handleAddItem("languages")} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all text-slate-300"><Plus size={16} /></button>
            </div>
            <div className="flex flex-wrap gap-3">
              {resumeData.languages.map((lang, idx) => (
                <div key={idx} className="relative group">
                  <input className="px-4 py-2 bg-[#0F172A] border-2 border-transparent rounded-xl focus:border-indigo-500 transition-all font-bold outline-none text-sm min-w-[100px] text-slate-200" value={lang} onChange={(e) => handleArrayItemChange("languages", idx, null, e.target.value)} />
                  <button onClick={() => handleRemoveItem("languages", idx)} className="absolute -top-1 -right-1 p-1 bg-red-500/20 text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={10} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className={sectionClass}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center text-pink-400"><Heart size={20} /></div>
                <h3 className="text-xl font-black text-slate-200">Interests</h3>
              </div>
              <button onClick={() => handleAddItem("interests")} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all text-slate-300"><Plus size={16} /></button>
            </div>
            <div className="flex flex-wrap gap-3">
              {resumeData.interests.map((interest, idx) => (
                <div key={idx} className="relative group">
                  <input className="px-4 py-2 bg-[#0F172A] border-2 border-transparent rounded-xl focus:border-indigo-500 transition-all font-bold outline-none text-sm min-w-[100px] text-slate-200" value={interest} onChange={(e) => handleArrayItemChange("interests", idx, null, e.target.value)} />
                  <button onClick={() => handleRemoveItem("interests", idx)} className="absolute -top-1 -right-1 p-1 bg-red-500/20 text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={10} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center pb-12">
          <button
            onClick={() => setCurrentStep("preview")}
            className="group inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-[24px] font-black text-xl hover:brightness-110 hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl shadow-indigo-500/30"
          >
            <Send size={22} />
            Submit Resume
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  };

  const renderPreview = () => {
    const activeTheme = themes[theme];
    const activeMode = pageModeStyles[pageMode];

    return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in zoom-in-95 duration-500">

      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8">

        <div className="bg-[#1E293B] shadow-lg shadow-black/20 p-2 rounded-2xl shadow-sm border border-slate-600 flex flex-wrap justify-center gap-2">
          {Object.entries(themes).map(([key, t]) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${theme === key ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="bg-[#1E293B] shadow-lg shadow-black/20 p-2 rounded-2xl shadow-sm border border-slate-600 flex flex-wrap justify-center gap-2">
          {[
            { id: "auto", label: "Auto (Default)" },
            { id: "compact", label: "1-Page Compact" },
            { id: "spacious", label: "2-Page Spacious" }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setPageMode(m.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${pageMode === m.id ? 'bg-cyan-500 text-slate-900 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {pageMode === "compact" && (
        <p className="text-center text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest animate-pulse">1-page compact resumes are ideal for freshers and short profiles</p>
      )}

      <div className="bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-50 overflow-hidden mb-10 transition-colors duration-500">

        <div className={`p-12 md:p-16 border-b-4 ${activeTheme.border} bg-gray-50/50 transition-colors duration-500 flex flex-col items-center text-center`}>
          <h1 className={`${activeMode.reactTitle} font-black text-gray-900 mb-4 transition-all duration-300`}>{resumeData.fullName}</h1>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 font-medium w-full">
            {resumeData.email && <span className="flex items-center gap-1.5"><Mail size={14} /> {resumeData.email}</span>}
            {resumeData.phone && <span className="flex items-center gap-1.5"><Phone size={14} /> {resumeData.phone}</span>}
            {resumeData.location && <span className="flex items-center gap-1.5"><MapPin size={14} /> {resumeData.location}</span>}
          </div>
          <div className={`flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm ${activeTheme.text} font-medium mt-2 transition-colors duration-500 w-full`}>
            {resumeData.linkedin && <span className="flex items-center gap-1.5"><Linkedin size={14} /> {resumeData.linkedin}</span>}
            {resumeData.github && <span className="flex items-center gap-1.5"><Github size={14} /> {resumeData.github}</span>}
            {resumeData.portfolio && <span className="flex items-center gap-1.5"><Globe size={14} /> {resumeData.portfolio}</span>}
          </div>
        </div>

        <div className={`p-12 md:p-16 ${activeMode.reactContainer} transition-all duration-500`}>

          {resumeData.summary && (
            <div>
              <h3 className={`text-xs font-black ${activeTheme.heading} uppercase tracking-[0.3em] ${activeMode.reactSectionMb} border-b border-gray-100 pb-3 transition-all duration-500`}>Professional Summary</h3>
              <p className={`${activeMode.reactText} text-gray-600 font-medium leading-relaxed transition-all duration-500`}>{resumeData.summary}</p>
            </div>
          )}

          {resumeData.skills?.filter(s => s).length > 0 && (
            <div>
              <h3 className={`text-xs font-black ${activeTheme.heading} uppercase tracking-[0.3em] ${activeMode.reactSectionMb} border-b border-gray-100 pb-3 transition-all duration-500`}>Skills</h3>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.filter(s => s).map((skill, i) => (
                  <span key={i} className={`${activeMode.reactPillPadding} ${activeTheme.pill} text-[11px] md:text-xs font-bold rounded-lg border transition-all duration-500`}>{skill}</span>
                ))}
              </div>
            </div>
          )}

          {resumeData.experience?.filter(e => e.company).length > 0 && (
            <div>
              <h3 className={`text-xs font-black ${activeTheme.heading} uppercase tracking-[0.3em] ${activeMode.reactSectionMb} border-b border-gray-100 pb-3 transition-all duration-500`}>Work Experience</h3>
              <div className="space-y-8">
                {resumeData.experience.filter(e => e.company).map((exp, i) => (
                  <div key={i}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                      <h4 className={`${activeMode.reactInfoRole} transition-all duration-500`}>{exp.role} <span className="text-gray-400 font-normal">@ {exp.company}</span></h4>
                      <span className={`${activeMode.reactText} text-gray-400 font-bold transition-all duration-500`}>{exp.period}</span>
                    </div>
                    <p className={`${activeMode.reactInfoDesc} text-gray-600 font-medium whitespace-pre-line leading-relaxed transition-all duration-500`}>{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resumeData.education?.filter(e => e.school).length > 0 && (
            <div>
              <h3 className={`text-xs font-black ${activeTheme.heading} uppercase tracking-[0.3em] ${activeMode.reactSectionMb} border-b border-gray-100 pb-3 transition-all duration-500`}>Education</h3>
              <div className="space-y-4">
                {resumeData.education.filter(e => e.school).map((edu, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h4 className={`${activeMode.reactInfoRole} transition-all duration-500`}>{edu.degree}</h4>
                      <p className={`${activeMode.reactInfoDesc} text-gray-500 transition-all duration-500`}>{edu.school}</p>
                    </div>
                    <span className={`${activeMode.reactText} text-gray-400 font-bold transition-all duration-500`}>{edu.period}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resumeData.projects?.filter(p => p.name).length > 0 && (
            <div>
              <h3 className={`text-xs font-black ${activeTheme.heading} uppercase tracking-[0.3em] ${activeMode.reactSectionMb} border-b border-gray-100 pb-3 transition-all duration-500`}>Projects</h3>
              <div className="space-y-6">
                {resumeData.projects.filter(p => p.name).map((proj, i) => (
                  <div key={i}>
                    <h4 className={`${activeMode.reactInfoRole} transition-all duration-500`}>{proj.name} {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className={`${activeTheme.link} text-xs font-normal ml-2 transition-colors duration-500`}>({proj.link})</a>}</h4>
                    <p className={`${activeMode.reactInfoDesc} text-gray-600 leading-relaxed transition-all duration-500`}>{proj.description}</p>
                    {proj.technologies && <p className="text-xs text-gray-400 mt-1.5 font-medium">Tech: {proj.technologies}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {resumeData.certifications?.filter(c => c.name).length > 0 && (
            <div>
              <h3 className={`text-xs font-black ${activeTheme.heading} uppercase tracking-[0.3em] ${activeMode.reactSectionMb} border-b border-gray-100 pb-3 transition-all duration-500`}>Certifications</h3>
              <div className="space-y-2">
                {resumeData.certifications.filter(c => c.name).map((cert, i) => (
                  <div key={i} className={`${activeMode.reactText} transition-all duration-500`}>
                    <span className="font-bold text-gray-900">{cert.name}</span> <span className="text-gray-400">—</span> <span className="text-gray-500">{cert.issuer}</span> {cert.date && <span className="text-gray-400 font-medium">({cert.date})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {resumeData.languages?.filter(l => l).length > 0 && (
            <div>
              <h3 className={`text-xs font-black ${activeTheme.heading} uppercase tracking-[0.3em] ${activeMode.reactSectionMb} border-b border-gray-100 pb-3 transition-all duration-500`}>Languages</h3>
              <div className="flex flex-wrap gap-2">
                {resumeData.languages.filter(l => l).map((lang, i) => (
                  <span key={i} className={`${activeMode.reactPillPadding} ${activeTheme.pill} text-[11px] md:text-xs font-bold rounded-lg border transition-all duration-500`}>{lang}</span>
                ))}
              </div>
            </div>
          )}

          {resumeData.interests?.filter(i => i).length > 0 && (
            <div>
              <h3 className={`text-xs font-black ${activeTheme.heading} uppercase tracking-[0.3em] ${activeMode.reactSectionMb} border-b border-gray-100 pb-3 transition-all duration-500`}>Interests</h3>
              <div className="flex flex-wrap gap-2">
                {resumeData.interests.filter(i => i).map((interest, idx) => (
                  <span key={idx} className={`${activeMode.reactPillPadding} ${activeTheme.pill} text-[11px] md:text-xs font-bold rounded-lg border transition-all duration-500`}>{interest}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-50 bg-gray-50/20 text-center">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Crafted with AI by JobSphere</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pb-12">
        <button
          onClick={() => setCurrentStep("form")}
          className="flex items-center gap-2 px-8 py-4 bg-[#1E293B] border-2 border-slate-600 text-slate-200 rounded-2xl font-black text-sm hover:bg-slate-700 hover:border-slate-600 transition-all shadow-sm"
        >
          <Edit3 size={18} /> Edit Resume
        </button>
        <button
          onClick={() => { setCurrentStep("input"); setDescription(""); setResumeData({ fullName: "", email: "", phone: "", linkedin: "", github: "", location: "", portfolio: "", summary: "", skills: [""], experience: [{ company: "", role: "", period: "", description: "" }], education: [{ school: "", degree: "", period: "" }], certifications: [{ name: "", issuer: "", date: "" }], projects: [{ name: "", description: "", technologies: "", link: "" }], languages: [""], interests: [""] }); }}
          className="flex items-center gap-2 px-8 py-4 bg-[#0F172A] text-slate-200 rounded-2xl font-black text-sm hover:bg-[#1E293B] transition-all shadow-lg border border-slate-600"
        >
          <RefreshCw size={18} /> Generate Another Resume
        </button>
        <button
          onClick={() => handleExportPDF('preview')}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-4 bg-[#1E293B] border-2 border-cyan-500/30 text-cyan-400 rounded-2xl font-black text-sm hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all shadow-sm disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
          Preview Resume
        </button>
        <button
          onClick={() => handleExportPDF('download')}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-2xl font-black text-sm hover:brightness-110 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
          Download Resume
        </button>
      </div>
    </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0F172A] relative pb-20 overflow-x-hidden">
      {loading && currentStep === "input" && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-indigo-900 rounded-full" />
            <div className="absolute inset-0 w-24 h-24 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400 animate-pulse" size={32} />
          </div>
          <p className="mt-8 font-black text-white uppercase tracking-[0.3em] text-sm animate-pulse">AI is crafting your resume...</p>
        </div>
      )}

      {currentStep === "hero" && renderHero()}
      {currentStep === "input" && renderInput()}
      {currentStep === "form" && renderForm()}
      {currentStep === "preview" && renderPreview()}
    </div>
  );
};

export default ResumeGenerator;
