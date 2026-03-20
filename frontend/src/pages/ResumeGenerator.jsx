import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FileText, Sparkles, Download, Copy, Save, RefreshCw, Check, Layout, Type, Briefcase } from "lucide-react";
import ReactMarkdown from "react-markdown";

const templates = [
  { id: "modern", name: "Modern", icon: Sparkles, desc: "Sleek & Creative" },
  { id: "minimal", name: "Minimal", icon: Type, desc: "ATS Friendly" },
  { id: "executive", name: "Executive", icon: Briefcase, desc: "Professional" }
];

const ResumeGenerator = () => {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [viewMode, setViewMode] = useState("gallery"); // 'gallery' or 'editor'

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/generate-resume",
        { additionalInfo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResume(res.data.data);
      toast.success("AI Resume generated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Generation failed");
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resume);
    toast.success("Copied to clipboard!");
  };

  const downloadPDF = async () => {
    const element = document.getElementById("resume-preview");
    if (!element) return;

    try {
      toast.info("Generating professional PDF...");
      
      // Capture HTML and relevant styles
      const htmlContent = element.outerHTML;
      
      // We send the computed styles or a base set of rules
      // For simplicity and quality, we'll send the template-specific CSS rules
      // that we've already defined in index.css (abstracted)
      const res = await axios.post(
        "http://localhost:5000/api/ai/export-pdf",
        { 
          html: htmlContent,
          userName: user?.name?.split(' ')[0] || "My",
          styles: `
            .resume-paper { width: 210mm; min-height: 297mm; padding: 20mm; background: white; }
            .template-modern { border-top: 20px solid #1e3a8a; }
            .template-modern h1 { font-weight: 800; font-size: 32pt; color: #1e3a8a; margin-bottom: 20pt; }
            .template-modern h2 { font-weight: 900; font-size: 14pt; color: #1d4ed8; text-transform: uppercase; margin-top: 20pt; margin-bottom: 10pt; border-bottom: 1px solid #dbeafe; padding-bottom: 5pt; }
            .template-minimal { color: #111827; }
            .template-minimal h1 { font-size: 28pt; font-weight: 300; text-align: center; margin-bottom: 30pt; border-bottom: 1px solid #e5e7eb; padding-bottom: 15pt; }
            .template-minimal h2 { font-size: 12pt; font-weight: 700; text-transform: uppercase; border-left: 4px solid black; padding-left: 10pt; margin-top: 20pt; }
            .template-executive { border-left: 30mm solid #0f172a; }
            .template-executive h1 { font-weight: 900; font-size: 32pt; margin-bottom: 10pt; }
            .template-executive h2 { font-size: 10pt; font-weight: 900; text-transform: uppercase; color: #64748b; margin-top: 25pt; }
            .prose h3 { font-weight: 700; margin-top: 15pt; }
            .prose p, .prose li { font-size: 11pt; line-height: 1.6; color: #334155; }
            ul { padding-left: 20pt; }
          `
        },
        { 
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob' 
        }
      );

      // Trigger direct download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${user?.name || 'Resume'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Download started!");
    } catch (err) {
      console.error("PDF Export Error:", err);
      toast.error("Professional export failed. Using fallback...");
      window.print();
    }
  };

  if (viewMode === "gallery") {
    return (
      <div className="min-h-screen bg-white p-8 md:p-16 flex flex-col items-center">
        <div className="max-w-6xl w-full">
          <header className="mb-16 text-center">
            <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">Selection</span>
            <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Pick your template</h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Choose a high-impact design to start building your career story. You can always change it later.</p>
          </header>

          <div className="template-grid">
            {templates.map((tpl) => (
              <div 
                key={tpl.id} 
                className={`template-card group ${selectedTemplate === tpl.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedTemplate(tpl.id);
                  setViewMode("editor");
                }}
              >
                <div className="template-thumb flex items-center justify-center relative">
                   {/* Mini Visual Preview */}
                   <div className={`w-3/4 aspect-[3/4] bg-white shadow-xl border border-gray-100 p-4 overflow-hidden template-${tpl.id} pointer-events-none`}>
                      <div className="h-4 w-1/2 bg-gray-200 mb-2"></div>
                      <div className="h-2 w-full bg-gray-100 mb-1"></div>
                      <div className="h-2 w-full bg-gray-100 mb-1"></div>
                      <div className="h-2 w-3/4 bg-gray-100"></div>
                      <div className="mt-4 flex gap-2">
                        <div className="h-2 w-4 bg-blue-200"></div>
                        <div className="h-2 w-12 bg-gray-100"></div>
                      </div>
                   </div>
                   {/* Hover Overlay */}
                   <div className="absolute inset-0 bg-blue-600/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm shadow-xl">
                        Use this template
                      </button>
                   </div>
                </div>
                <div className="p-6 border-t border-gray-50 bg-white">
                  <div className="flex items-center gap-3 mb-1">
                    <tpl.icon size={20} className="text-blue-600" />
                    <h3 className="font-black text-gray-900">{tpl.name}</h3>
                  </div>
                  <p className="text-xs text-gray-400 font-medium">{tpl.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 no-print">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setViewMode("gallery")}
              className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-400 hover:text-blue-600 transition-colors shadow-sm"
              title="Back to Templates"
            >
              <Layout size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                Resume Architect <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">Beta</span>
              </h1>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{selectedTemplate} Template</p>
            </div>
          </div>
          <div className="flex gap-3">
             <button onClick={handleGenerate} disabled={loading} className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-600 transition shadow-lg shadow-gray-200">
                {loading ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                {loading ? "Regenerating..." : "AI Sync"}
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls & Templates */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6 no-print">
            {/* Template Quick Switch */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.15em]">
                Quick Style Swapper
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={`p-3 rounded-xl flex flex-col items-center transition-all ${
                      selectedTemplate === tpl.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    }`}
                    title={tpl.name}
                  >
                    <tpl.icon size={18} />
                    <span className="text-[8px] font-black uppercase mt-1">{tpl.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.15em]">
                <FileText size={16} className="text-blue-600" /> Context Editor
              </h3>
              <textarea
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm h-64 resize-none"
                placeholder="Paste your experience or specify career goals..."
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
              <p className="mt-3 text-[10px] text-gray-400 font-medium">Higher quality context leads to better AI results.</p>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-200 overflow-hidden flex flex-col sticky top-8">
              <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex justify-between items-center no-print">
                <div className="flex items-center gap-2 text-gray-400">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest">A4 Live Draft</span>
                </div>
                {resume && (
                  <div className="flex gap-2">
                    <button onClick={copyToClipboard} className="p-2.5 text-gray-500 hover:text-blue-600 transition flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white border border-gray-100 rounded-xl shadow-sm">
                      <Copy size={14} /> Copy
                    </button>
                    <button onClick={downloadPDF} className="p-2.5 text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-2 text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-100">
                      <Download size={14} /> Download PDF
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)] p-12 flex justify-center bg-gray-100/50">
                {resume ? (
                  <div 
                    id="resume-preview" 
                    className={`resume-paper template-${selectedTemplate} shadow-2xl transition-all duration-500`}
                  >
                    <div className="prose prose-slate max-w-none">
                      <ReactMarkdown>{resume}</ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center text-gray-400 py-20 px-8">
                    <div className="p-8 bg-blue-50 rounded-full mb-8 text-blue-600">
                      <Sparkles size={64} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Editor stands ready.</h2>
                    <p className="text-gray-500 max-w-sm font-medium">Type your career goals and sync with AI to see the selected template come to life.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hide elements during print */}
      <style>{`
        @media print {
          .no-print, header, .lg\\:col-span-1, .bg-gray-50, .border-b {
            display: none !important;
          }
          .min-h-screen {
            background: white !important;
            padding: 0 !important;
          }
          .lg\\:col-span-2 {
            width: 100% !important;
          }
          #resume-preview {
            box-shadow: none !important;
            padding: 0 !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumeGenerator;
