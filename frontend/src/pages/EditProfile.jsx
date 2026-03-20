import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
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
  RefreshCw
} from "lucide-react";

const EditProfile = () => {
  const { user, token, setMe } = useAuth();
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
  });

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data.data;
      setFormData({
        name: data.name || "",
        bio: data.bio || "",
        skills: data.skills || [],
        skillInput: "",
        location: data.location || "",
        role: data.role || "",
      });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Profile updated successfully!");
      // Navigate based on role
      navigate(user?.role === "employer" ? "/employer-dashboard" : "/freelancer-dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <RefreshCw className="animate-spin text-blue-600" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 lg:p-12">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold mb-8 group transition"
        >
          <ChevronLeft className="group-hover:-translate-x-1 transition" /> Back to Dashboard
        </button>

        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
          <header className="bg-blue-600 p-10 text-white relative">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <Sparkles size={80} />
            </div>
            <h1 className="text-3xl font-black tracking-tight">Edit Profile</h1>
            <p className="text-blue-100 font-medium italic mt-1">Refine your professional presence on JobSphere.</p>
          </header>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-4 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold transition"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Location</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-4 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold transition"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Professional Bio</label>
              <textarea
                className="w-full p-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-3xl h-40 outline-none font-medium text-gray-700 leading-relaxed transition"
                placeholder="Tell your professional story..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            {user?.role === "freelancer" && (
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Expertise & Skills</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    className="flex-1 p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold transition"
                    placeholder="Add a skill (e.g. React, Python)"
                    value={formData.skillInput}
                    onChange={(e) => setFormData({ ...formData, skillInput: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill(e)}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="bg-blue-600 text-white px-8 rounded-2xl font-black hover:bg-gray-900 transition active:scale-95"
                  >
                    <Plus size={24} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.skills.map(skill => (
                    <span key={skill} className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl font-black text-sm border border-blue-100 flex items-center gap-3">
                      {skill}
                      <X size={14} className="cursor-pointer hover:text-red-500 transition" onClick={() => removeSkill(skill)} />
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-8 border-t flex items-center justify-between">
              <p className="text-gray-400 text-sm font-medium italic">All changes are updated instantly across the platform.</p>
              <button
                type="submit"
                disabled={saving}
                className="bg-gray-900 text-white px-10 py-4 rounded-[1.5rem] font-black hover:bg-blue-600 transition flex items-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
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
