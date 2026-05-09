import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";
import { getCroppedImgBlob } from "../utils/cropImage";
import { 
  User, 
  Mail, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  Save, 
  ChevronLeft, 
  Plus, 
  X,
  RefreshCw,
  Camera,
  Trash2,
  Phone,
  Github,
  Linkedin,
  Globe,
  ShieldCheck,
  Award
} from "lucide-react";

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: [],
    skillInput: "",
    location: "",
    role: "",
    phone: "",
    github: "",
    linkedin: "",
    website: "",
    profileImage: "",
    isMentor: false,
    mentorBio: "",
    mentorExperience: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [tempImage, setTempImage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      const data = res.data.data;
      setFormData({
        name: data.name || "",
        bio: data.bio || "",
        skills: data.skills || [],
        skillInput: "",
        location: data.location || "",
        role: data.role || "",
        phone: data.phone || "",
        github: data.github || "",
        linkedin: data.linkedin || "",
        website: data.website || "",
        profileImage: data.profileImage || "",
        resumeUrl: data.resumeUrl || "",
        isMentor: data.isMentor || false,
        mentorBio: data.mentorBio || "",
        mentorExperience: data.mentorExperience || 0,
      });
      if (data.profileImage) {
        setImagePreview(data.profileImage);
      }
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempImage(URL.createObjectURL(file));
      setShowCropModal(true);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    try {
      const croppedBlob = await getCroppedImgBlob(tempImage, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], "profile.jpg", { type: "image/jpeg" });

      setImageFile(croppedFile);
      setImagePreview(URL.createObjectURL(croppedBlob));
      setShowCropModal(false);
      setTempImage(null);
      toast.success("Image cropped successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to crop image");
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData({ ...formData, profileImage: "" });
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.profileImage;

    const uploadData = new FormData();
    uploadData.append("profileImage", imageFile);

    try {
      const res = await api.post("/upload/profile-image", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.data;
    } catch (err) {
      console.error("Image upload failed", err);
      toast.error("Failed to upload image");
      return formData.profileImage;
    }
  };

  const uploadResume = async () => {
    if (!resumeFile) return formData.resumeUrl;

    const uploadData = new FormData();
    uploadData.append("resume", resumeFile);

    try {
      const res = await api.post("/upload/resume", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.data;
    } catch (err) {
      console.error("Resume upload failed", err);
       toast.error("Failed to upload resume document");
      return formData.resumeUrl;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const profileImageUrl = await uploadImage();
      const uploadedResumeUrl = await uploadResume();
      const updatedData = {
        ...formData,
        profileImage: profileImageUrl,
        resumeUrl: uploadedResumeUrl,
        isMentor: formData.isMentor,
        mentorBio: formData.mentorBio,
        mentorExperience: formData.mentorExperience,
      };

      await api.put("/auth/update-profile", updatedData);
      toast.success("Profile updated successfully!");
      navigate(user?.role === "employer" ? "/employer-dashboard" : "/freelancer-dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <RefreshCw className="animate-spin text-indigo-600 dark:text-indigo-400" size={32} />
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold mb-8 group transition transition-colors"
        >
          <ChevronLeft className="group-hover:-translate-x-1 transition" /> Back to Dashboard
        </button>

        <div className="bg-white dark:bg-[#1E293B] shadow-xl dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] rounded-[3rem] border border-slate-100 dark:border-slate-600/50 overflow-hidden transition-colors">
          <header className="bg-gradient-to-r from-indigo-500 to-violet-600 p-8 md:p-12 text-white relative pb-16 md:pb-24">
            <h1 className="text-2xl md:text-4xl font-black tracking-tight">Edit Profile</h1>
            <p className="text-indigo-100 font-black uppercase tracking-widest text-[10px] md:text-xs mt-2 md:mt-3 px-1">Refine your professional presence on JobSphere</p>
          </header>

          <form onSubmit={handleSubmit} className="p-6 md:p-10 pt-0 space-y-6 md:space-y-8 relative">
            <div className="flex flex-col items-center -mt-16 mb-8 relative z-10">
              <div className="relative group">
                <div
                  className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl bg-slate-50 dark:bg-[#0F172A] flex items-center justify-center cursor-pointer active:scale-95 transition transition-colors"
                  onClick={() => imagePreview && imagePreview !== "no-photo.jpg" && setShowPhotoModal(true)}
                >
                  {imagePreview && imagePreview !== "no-photo.jpg" ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="text-slate-400 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>';
                      }}
                    />
                  ) : (
                    <User size={48} className="text-slate-400 dark:text-slate-500 transition-colors" />
                  )}
                </div>

                <label className="absolute bottom-0 right-0 bg-gradient-to-r from-indigo-500 to-violet-600 text-white p-2.5 rounded-full shadow-lg border-2 border-white dark:border-slate-800 cursor-pointer hover:brightness-110 transition active:scale-95 group-hover:scale-110 transition-colors">
                   <Camera size={22} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
              <p className="mt-4 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 transition-colors">Profile Picture</p>
            </div>

            {showCropModal && (
              <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex flex-col items-center justify-center p-4">
                <div className="relative w-full max-w-2xl aspect-square bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
                  <Cropper
                    image={tempImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>

                <div className="mt-8 w-full max-w-md space-y-6 bg-slate-800/50 p-8 rounded-[2rem] border border-white/5 backdrop-blur-xl">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Zoom Level</span>
                      <span className="text-xs font-black text-indigo-400">{Math.round(zoom * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      aria-labelledby="Zoom"
                      onChange={(e) => setZoom(e.target.value)}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCropModal(false);
                        setTempImage(null);
                      }}
                      className="flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-700 transition active:scale-95"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCropSave}
                      className="flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-500/20 hover:brightness-110 transition active:scale-95"
                    >
                      Done Cropping
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showPhotoModal && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="absolute top-6 right-6 text-white/50 hover:text-white transition"
                >
                  <X size={32} />
                </button>

                <div className="max-w-md w-full flex flex-col items-center">
                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-slate-600 shadow-2xl mb-8">
                    <img src={imagePreview} alt="Profile Large" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        handleRemoveImage();
                        setShowPhotoModal(false);
                      }}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-bold transition shadow-xl active:scale-95"
                    >
                      <Trash2 size={18} />
                      Remove Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPhotoModal(false)}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-2xl font-bold transition backdrop-blur-md active:scale-95"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
               <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1 transition-colors">Full Name</label>
                <div className="relative group/input">
                  <User size={22} className="absolute left-6 top-6 text-slate-400 dark:text-slate-500 group-focus-within/input:text-indigo-600 dark:group-focus-within/input:text-indigo-400 transition-colors" />
                  <input
                    type="text"
                    className="w-full pl-16 pr-8 py-6 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-600/50 focus:border-indigo-500/50 rounded-2xl outline-none font-black transition text-base text-slate-900 dark:text-[#E2E8F0] placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner transition-colors"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

               <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1 transition-colors">Location</label>
                <div className="relative group/input">
                  <MapPin size={22} className="absolute left-6 top-6 text-slate-400 dark:text-slate-500 group-focus-within/input:text-indigo-600 dark:group-focus-within/input:text-indigo-400 transition-colors" />
                  <input
                    type="text"
                    className="w-full pl-16 pr-8 py-6 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-600/50 focus:border-indigo-500/50 rounded-2xl outline-none font-black transition text-base text-slate-900 dark:text-[#E2E8F0] placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner transition-colors"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1 transition-colors">Phone Number</label>
                <div className="relative group/input">
                  <Phone size={18} className="absolute left-5 top-5 text-slate-400 dark:text-slate-500 group-focus-within/input:text-indigo-600 dark:group-focus-within/input:text-indigo-400 transition-colors" />
                  <input
                    type="text"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-600/50 focus:border-indigo-500/50 rounded-2xl outline-none font-bold transition text-slate-900 dark:text-[#E2E8F0] placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner transition-colors"
                    placeholder="+1 234 567 890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1 transition-colors">Personal Website</label>
                <div className="relative group/input">
                  <Globe size={18} className="absolute left-5 top-5 text-slate-400 dark:text-slate-500 group-focus-within/input:text-indigo-600 dark:group-focus-within/input:text-indigo-400 transition-colors" />
                  <input
                    type="url"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-600/50 focus:border-indigo-500/50 rounded-2xl outline-none font-bold transition text-slate-900 dark:text-[#E2E8F0] placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner transition-colors"
                    placeholder="https://yourwebsite.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1 transition-colors">GitHub Profile</label>
                <div className="relative group/input">
                  <Github size={18} className="absolute left-4 top-4 text-slate-400 dark:text-slate-500 transition-colors" />
                  <input
                    type="url"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-600 focus:border-indigo-500 rounded-2xl outline-none font-bold transition text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                    placeholder="https://github.com/username"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1 transition-colors">LinkedIn Profile</label>
                <div className="relative group/input">
                  <Linkedin size={18} className="absolute left-4 top-4 text-slate-400 dark:text-slate-500 transition-colors" />
                  <input
                    type="url"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-600 focus:border-indigo-500 rounded-2xl outline-none font-bold transition text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1 transition-colors">Professional Bio</label>
              <textarea
                className="w-full p-8 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-600/50 focus:border-indigo-500/50 rounded-[2rem] h-48 outline-none font-medium text-slate-700 dark:text-slate-300 leading-relaxed transition placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner transition-colors resize-none"
                placeholder="Tell your professional story..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            {user?.role === "freelancer" && (
              <>
                <div className="space-y-4 mb-8">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1 transition-colors">Professional Resume (PDF/DOC)</label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-600/50 rounded-2xl shadow-inner transition-colors">
                    <div className="w-12 h-12 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 dark:text-slate-200 font-bold mb-1 truncate text-sm transition-colors">Upload New Resume</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs truncate transition-colors">
                        {resumeFile ? resumeFile.name : (formData.resumeUrl ? "Current resume attached. Select file to replace it." : "No resume uploaded yet")}
                      </p>
                      {formData.resumeUrl && !resumeFile && (
                        <a href={formData.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-xs font-bold mt-1 inline-block transition transition-colors">
                          View Current Resume
                        </a>
                      )}
                    </div>
                    <label className="cursor-pointer bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-6 py-3 rounded-xl text-slate-700 dark:text-slate-200 font-bold text-sm transition-all shadow-md active:scale-95 whitespace-nowrap text-center transition-colors">
                      Choose File
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1 transition-colors">Expertise & Skills</label>
                  <div className="flex gap-2 md:gap-4">
                  <input
                    type="text"
                    className="flex-1 pl-4 md:pl-6 pr-4 md:pr-6 py-4 md:py-5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-600/50 focus:border-indigo-500/50 rounded-xl md:rounded-2xl outline-none font-bold transition text-sm md:text-base text-slate-900 dark:text-[#E2E8F0] placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner transition-colors"
                    placeholder="Add a skill (e.g. React, Python)"
                    value={formData.skillInput}
                    onChange={(e) => setFormData({ ...formData, skillInput: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill(e)}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="bg-indigo-600 dark:bg-indigo-500/10 text-white dark:text-indigo-400 px-5 md:px-8 rounded-xl md:rounded-2xl font-black border border-transparent dark:border-indigo-500/20 hover:bg-indigo-700 dark:hover:bg-gradient-to-r dark:hover:from-indigo-500 dark:hover:to-violet-600 dark:hover:text-white transition-all duration-300 active:scale-95 shadow-lg shadow-indigo-500/10 flex items-center justify-center transition-colors shrink-0"
                  >
                    <Plus size={20} className="md:w-6 md:h-6" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.skills.map(skill => (
                    <span key={skill} className="bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-3 md:px-5 py-2 md:py-2.5 rounded-xl font-black text-xs md:text-sm border border-indigo-100 dark:border-indigo-500/30 flex items-center gap-2 md:gap-3 transition-colors">
                      {skill}
                      <X size={12} className="md:w-[14px] md:h-[14px] cursor-pointer hover:text-red-500 dark:hover:text-red-400 transition transition-colors" onClick={() => removeSkill(skill)} />
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-4 border-t border-slate-100 dark:border-slate-700/50 transition-colors">
                <div className="bg-slate-50 dark:bg-slate-800/20 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-700/50 transition-colors">
                  <div className="flex items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                      <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl transition-colors shrink-0 ${formData.isMentor ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'bg-slate-200 dark:bg-slate-700/50 text-slate-500 dark:text-slate-500'}`}>
                        <ShieldCheck size={22} className="md:w-7 md:h-7" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm md:text-xl font-black text-slate-900 dark:text-slate-200 uppercase tracking-tight transition-colors truncate">Become a Mentor</h3>
                        <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5 transition-colors line-clamp-1 md:line-clamp-none">Share your expertise and guide others</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={formData.isMentor}
                        onChange={(e) => setFormData({ ...formData, isMentor: e.target.checked })}
                      />
                      <div className="w-12 h-6 md:w-16 md:h-8 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] md:after:top-[4px] after:left-[2px] md:after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 md:after:h-6 after:w-5 md:after:w-6 after:transition-all peer-checked:bg-indigo-600 transition-colors"></div>
                    </label>
                  </div>

                  {formData.isMentor && (
                    <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 ml-1 transition-colors">Mentor Professional Bio</label>
                        <textarea
                          className="w-full p-6 bg-slate-100 dark:bg-[#0F172A] border border-indigo-200 dark:border-indigo-500/20 focus:border-indigo-500/50 rounded-2xl h-32 outline-none font-medium text-slate-700 dark:text-slate-300 leading-relaxed transition shadow-inner transition-colors"
                          placeholder="What specific guidance can you offer to mentees?"
                          value={formData.mentorBio}
                          onChange={(e) => setFormData({ ...formData, mentorBio: e.target.value })}
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 ml-1 transition-colors">Years of Mentorship Experience</label>
                        <div className="relative group/input">
                          <Award size={18} className="absolute left-5 top-5 text-slate-400 dark:text-slate-500 group-focus-within/input:text-indigo-600 dark:group-focus-within/input:text-indigo-400 transition-colors" />
                          <input
                            type="number"
                            className="w-full pl-14 pr-6 py-5 bg-slate-100 dark:bg-[#0F172A] border border-indigo-200 dark:border-indigo-500/20 focus:border-indigo-500/50 rounded-xl outline-none font-bold transition text-slate-900 dark:text-[#E2E8F0] shadow-inner transition-colors"
                            value={formData.mentorExperience}
                            onChange={(e) => setFormData({ ...formData, mentorExperience: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              </>
            )}

            <div className="pt-8 border-t border-slate-100 dark:border-slate-600 flex items-center justify-between transition-colors">
              <p className="hidden md:block text-slate-500 dark:text-slate-400 text-sm font-medium italic transition-colors">All changes are updated instantly across the platform.</p>
              <button
                type="submit"
                disabled={saving}
                className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-10 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] font-black hover:brightness-110 transition flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs md:text-sm"
              >
                {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
