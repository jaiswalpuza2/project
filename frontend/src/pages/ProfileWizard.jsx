import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import { User, FileText, Briefcase, Plus, X, Building, MapPin, UploadCloud, ChevronRight, CheckCircle, Sparkles, RefreshCw } from "lucide-react";

const ProfileWizard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    bio: "",
    skills: [],
    skillInput: "",
    portfolio: [],
    companyLogo: "",
    companyDescription: "",
    location: "",
    resumeUrl: "",
  });
  const [uploadLoading, setUploadLoading] = useState(false);

  const fileInputRef = React.useRef(null);

  const isEmployer = user?.role === "employer";
  const totalSteps = isEmployer ? 3 : 4;

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const addSkill = (e) => {
    e.preventDefault();
    if (formData.skillInput.trim() && !formData.skills.includes(formData.skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, formData.skillInput.trim()],
        skillInput: "",
      });
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("resume", file);

    setUploadLoading(true);
    try {
      const res = await api.post("/upload/resume", formDataUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFormData({ ...formData, resumeUrl: res.data.data });
      toast.success("Resume uploaded successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.put("/auth/update-profile", formData);
      toast.success("Profile completed successfully!");
      navigate(isEmployer ? "/employer-dashboard" : "/freelancer-dashboard");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] flex items-center justify-center p-2 md:p-4 font-['Plus_Jakarta_Sans'] transition-colors duration-500">
      <div className="max-w-3xl w-full bg-white dark:bg-[#1E293B] shadow-2xl dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] rounded-2xl md:rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-600/50 relative transition-colors duration-500">
        <div className="bg-gradient-to-r from-indigo-500 to-violet-600 p-8 md:p-12 text-white relative overflow-hidden">

          <div className="flex items-center gap-3 mb-4">

             <h2 className="text-2xl font-black tracking-tighter uppercase text-cyan-400">JobSphere</h2>
          </div>
          <h2 className="text-xl md:text-3xl font-black tracking-tight">{isEmployer ? "Employer Hub" : "Freelancer Setup"}</h2>
          <p className="mt-1 md:mt-2 text-xs md:text-base text-indigo-100 font-medium italic">
            {isEmployer ? "Build your company presence." : "Let's highlight your professional excellence."}
          </p>
          <div className="mt-8 flex gap-3">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                  i + 1 <= step ? "bg-cyan-400 shadow-lg shadow-cyan-400/20" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 md:p-10">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-10">
                <div className="p-3 md:p-5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl md:rounded-2xl border border-indigo-500/20 shadow-lg shadow-indigo-500/5 transition-colors">
                  <FileText size={24} className="md:w-7 md:h-7" />
                </div>
                <div>
                  <h3 className="text-xl md:text-3xl font-black text-slate-900 dark:text-[#E2E8F0] leading-tight tracking-tight transition-colors">Professional Bio</h3>
                  <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium italic mt-1 transition-colors">Summarize your journey and expertise.</p>
                </div>
              </div>
              <textarea
                className="w-full p-6 md:p-8 border border-slate-200 dark:border-slate-600/50 bg-slate-50 dark:bg-[#0F172A] rounded-2xl md:rounded-[2.5rem] h-48 md:h-56 resize-none focus:border-indigo-500/50 outline-none transition font-medium text-sm md:text-base text-slate-800 dark:text-slate-300 leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner"
                placeholder={isEmployer ? "Describe your company values and culture..." : "Write a compelling summary of your career highlights..."}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
          )}

          {step === 2 && !isEmployer && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-2xl transition-colors">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-slate-200 leading-tight transition-colors">Mastered Skills</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic transition-colors">Add skills to get matched with the right jobs.</p>
                </div>
              </div>
              <form onSubmit={addSkill} className="flex flex-col sm:flex-row gap-3 md:gap-4 transition-colors">
                <input
                  type="text"
                  className="flex-1 p-4 md:p-5 border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-[#0F172A] rounded-xl md:rounded-2xl outline-none focus:border-violet-500 transition font-bold text-sm md:text-base text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                  placeholder="E.g. Full-Stack Dev, UI/UX..."
                  value={formData.skillInput}
                  onChange={(e) => setFormData({ ...formData, skillInput: e.target.value })}
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-8 py-4 md:py-0 rounded-xl md:rounded-2xl font-black hover:brightness-110 transition shadow-lg shadow-indigo-500/20 uppercase tracking-widest text-xs"
                >
                  Add
                </button>
              </form>
              <div className="flex flex-wrap gap-3 mt-6">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-slate-50 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 px-6 py-3 rounded-2xl flex items-center gap-3 font-bold text-sm border border-slate-200 dark:border-slate-600 transition-colors"
                  >
                    {skill}
                    <X
                      className="h-4 w-4 cursor-pointer text-slate-400 dark:text-slate-500 hover:text-red-500 transition"
                      onClick={() => removeSkill(skill)}
                    />
                  </span>
                ))}
              </div>
            </div>
          )}

          {step === 2 && isEmployer && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-6 mb-10">
                <div className="p-5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20 shadow-lg shadow-emerald-500/5 transition-colors">
                  <Building size={28} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-[#E2E8F0] leading-tight tracking-tight transition-colors">Company Identity</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-1 transition-colors">Help talent trust your brand.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1 transition-colors">Logo URL</label>
                  <input
                    type="text"
                    className="w-full p-5 border border-slate-200 dark:border-slate-600/50 bg-slate-50 dark:bg-[#0F172A] rounded-2xl outline-none focus:border-emerald-500/50 transition font-bold text-slate-900 dark:text-[#E2E8F0] placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner"
                    placeholder="https://..."
                    value={formData.companyLogo}
                    onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1 transition-colors">HQ Location</label>
                  <input
                    type="text"
                    className="w-full p-5 border border-slate-200 dark:border-slate-600/50 bg-slate-50 dark:bg-[#0F172A] rounded-2xl outline-none focus:border-emerald-500/50 transition font-bold text-slate-900 dark:text-[#E2E8F0] placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner"
                    placeholder="San Francisco, CA"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1 transition-colors">Elevator Pitch</label>
                <textarea
                  className="w-full p-5 border border-slate-200 dark:border-slate-600/50 bg-slate-50 dark:bg-[#0F172A] rounded-2xl h-32 resize-none focus:border-emerald-500/50 outline-none transition font-medium text-slate-800 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner"
                  placeholder="One sentence that defines your company..."
                  value={formData.companyDescription}
                  onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 3 && !isEmployer && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl transition-colors">
                  <UploadCloud size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-slate-200 leading-tight transition-colors">Resume Management</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic transition-colors">Upload your latest resume for instant applications.</p>
                </div>
              </div>
              <div 
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-[2rem] p-12 text-center group hover:border-indigo-500/30 transition cursor-pointer relative transition-colors"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
                <div className="inline-block p-6 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-3xl mb-6 group-hover:scale-110 transition duration-500 transition-colors">
                  {uploadLoading ? (
                    <RefreshCw className="animate-spin" size={48} />
                  ) : (
                    <UploadCloud size={48} />
                  )}
                </div>
                <h4 className="text-xl font-black text-slate-900 dark:text-slate-200 transition-colors">
                  {formData.resumeUrl ? "Resume Uploaded ✓" : "Upload PDF / Word"}
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 font-medium transition-colors">
                  {formData.resumeUrl 
                    ? "Click to change file or edit the link below." 
                    : "Or paste a public Google Drive / Dropbox link below."}
                </p>
                <input
                  type="text"
                  className="mt-8 w-full p-4 border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-[#0F172A] rounded-2xl outline-none focus:border-indigo-500 transition font-bold text-center text-slate-800 dark:text-slate-200 placeholder:text-slate-400 transition-colors"
                  placeholder="https://..."
                  value={formData.resumeUrl}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                />
              </div>
            </div>
          )}

          {( (step === 3 && isEmployer) || (step === 4 && !isEmployer) ) && (
            <div className="text-center py-12 animate-in fade-in zoom-in duration-700">
              <div className="inline-block p-8 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full mb-8 shadow-xl shadow-emerald-500/5 transition-colors">
                <CheckCircle size={64} />
              </div>
              <h3 className="text-4xl font-black text-slate-900 dark:text-slate-200 mb-4 tracking-tight transition-colors">You're All Set!</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg font-medium max-w-sm mx-auto italic leading-relaxed transition-colors">
                Your profile is now verified and optimized for global reach. Welcome to the JobSphere family.
              </p>
            </div>
          )}

          <div className="mt-12 flex justify-between">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-10 py-4 text-slate-400 font-black hover:text-slate-200 transition active:scale-95 uppercase tracking-widest text-xs"
              >
                Go Back
              </button>
            )}
            <div className="ml-auto">
              {step < totalSteps ? (
                  <button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] font-black hover:brightness-110 transition flex items-center gap-3 shadow-xl shadow-indigo-500/20 active:scale-95 uppercase tracking-widest text-[10px] md:text-xs"
                  >
                    Continue <ChevronRight size={18} />
                  </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="bg-cyan-400 text-slate-900 px-12 py-5 rounded-[1.5rem] font-black hover:bg-cyan-300 transition flex items-center gap-3 shadow-xl shadow-cyan-400/20 active:scale-95 uppercase tracking-widest text-xs"
                >
                  Complete Setup <CheckCircle size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileWizard;
