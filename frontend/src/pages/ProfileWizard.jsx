import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { User, FileText, Briefcase, Plus, X, Building, MapPin, UploadCloud, ChevronRight, CheckCircle, Sparkles, RefreshCw } from "lucide-react";

const ProfileWizard = () => {
  const { user, token } = useAuth();
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
      const res = await axios.post(
        "http://localhost:5000/api/upload/resume",
        formDataUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Profile completed successfully!");
      navigate(isEmployer ? "/employer-dashboard" : "/freelancer-dashboard");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-['Plus_Jakarta_Sans']">
      <div className="max-w-3xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-blue-600 p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Sparkles size={120} />
          </div>
          <h2 className="text-4xl font-black tracking-tight">Onboarding</h2>
          <p className="mt-2 text-blue-100 font-medium italic opacity-80">
            {isEmployer ? "Build your company presence." : "Let's highlight your professional excellence."}
          </p>
          <div className="mt-8 flex gap-3">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2.5 flex-1 rounded-full transition-all duration-500 ${
                  i + 1 <= step ? "bg-white shadow-lg shadow-white/20" : "bg-blue-400/50"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-10">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 leading-tight">Professional Bio</h3>
                  <p className="text-gray-400 text-sm font-medium italic">Summarize your journey and expertise.</p>
                </div>
              </div>
              <textarea
                className="w-full p-6 border-2 border-gray-100 rounded-3xl h-48 focus:border-blue-500 outline-none transition font-medium text-gray-700 leading-relaxed"
                placeholder={isEmployer ? "Describe your company values and culture..." : "Write a compelling summary of your career highlights..."}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
          )}

          {step === 2 && !isEmployer && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 leading-tight">Mastered Skills</h3>
                  <p className="text-gray-400 text-sm font-medium italic">Add skills to get matched with the right jobs.</p>
                </div>
              </div>
              <form onSubmit={addSkill} className="flex gap-4">
                <input
                  type="text"
                  className="flex-1 p-5 border-2 border-gray-100 rounded-2xl outline-none focus:border-purple-500 transition font-bold"
                  placeholder="E.g. Full-Stack Dev, UI/UX..."
                  value={formData.skillInput}
                  onChange={(e) => setFormData({ ...formData, skillInput: e.target.value })}
                />
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-8 rounded-2xl font-black hover:bg-purple-700 transition shadow-lg shadow-purple-100"
                >
                  Add
                </button>
              </form>
              <div className="flex flex-wrap gap-3 mt-6">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-gray-50 text-gray-700 px-6 py-3 rounded-2xl flex items-center gap-3 font-bold text-sm border border-gray-100"
                  >
                    {skill}
                    <X
                      className="h-4 w-4 cursor-pointer text-gray-400 hover:text-red-500 transition"
                      onClick={() => removeSkill(skill)}
                    />
                  </span>
                ))}
              </div>
            </div>
          )}

          {step === 2 && isEmployer && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <Building size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 leading-tight">Company Identity</h3>
                  <p className="text-gray-400 text-sm font-medium italic">Help talent trust your brand.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Logo URL</label>
                  <input
                    type="text"
                    className="w-full p-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-emerald-500 transition font-bold"
                    placeholder="https://..."
                    value={formData.companyLogo}
                    onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">HQ Location</label>
                  <input
                    type="text"
                    className="w-full p-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-emerald-500 transition font-bold"
                    placeholder="San Francisco, CA"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Elevator Pitch</label>
                <textarea
                  className="w-full p-4 border-2 border-gray-100 rounded-2xl h-32 focus:border-emerald-500 outline-none transition font-medium"
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
                <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl">
                  <UploadCloud size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 leading-tight">Resume Management</h3>
                  <p className="text-gray-400 text-sm font-medium italic">Upload your latest resume for instant applications.</p>
                </div>
              </div>
              <div 
                onClick={() => fileInputRef.current.click()}
                className="border-4 border-dashed border-gray-50 rounded-[2rem] p-12 text-center group hover:border-blue-100 transition cursor-pointer relative"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
                <div className="inline-block p-6 bg-blue-50 text-blue-600 rounded-3xl mb-6 group-hover:scale-110 transition duration-500 shadow-lg shadow-blue-50">
                  {uploadLoading ? (
                    <RefreshCw className="animate-spin" size={48} />
                  ) : (
                    <UploadCloud size={48} />
                  )}
                </div>
                <h4 className="text-xl font-black text-gray-900">
                  {formData.resumeUrl ? "Resume Uploaded ✓" : "Upload PDF / Word"}
                </h4>
                <p className="text-gray-400 text-sm mt-3 font-medium">
                  {formData.resumeUrl 
                    ? "Click to change file or edit the link below." 
                    : "Or paste a public Google Drive / Dropbox link below."}
                </p>
                <input
                  type="text"
                  className="mt-8 w-full p-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 transition font-bold text-center"
                  placeholder="https://..."
                  value={formData.resumeUrl}
                  onClick={(e) => e.stopPropagation()} // Prevent triggering file input click
                  onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                />
              </div>
            </div>
          )}

          {( (step === 3 && isEmployer) || (step === 4 && !isEmployer) ) && (
            <div className="text-center py-12 animate-in fade-in zoom-in duration-700">
              <div className="inline-block p-8 bg-emerald-50 text-emerald-600 rounded-full mb-8 shadow-xl shadow-emerald-50">
                <CheckCircle size={64} />
              </div>
              <h3 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">You're All Set!</h3>
              <p className="text-gray-500 text-lg font-medium max-w-sm mx-auto italic leading-relaxed">
                Your profile is now verified and optimized for global reach. Welcome to the JobSphere family.
              </p>
            </div>
          )}

          <div className="mt-12 flex justify-between">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-10 py-4 text-gray-400 font-black hover:text-gray-900 transition active:scale-95 uppercase tracking-widest text-xs"
              >
                Go Back
              </button>
            )}
            <div className="ml-auto">
              {step < totalSteps ? (
                <button
                  onClick={handleNext}
                  className="bg-blue-600 text-white px-12 py-5 rounded-[1.5rem] font-black hover:bg-gray-900 transition flex items-center gap-3 shadow-xl shadow-blue-100 active:scale-95"
                >
                  Continue <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="bg-emerald-600 text-white px-12 py-5 rounded-[1.5rem] font-black hover:bg-gray-900 transition flex items-center gap-3 shadow-xl shadow-emerald-100 active:scale-95"
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
