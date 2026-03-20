import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bookmark, Star, Trash2, MapPin, Briefcase, Clock, DollarSign } from "lucide-react";
import { toast } from "react-toastify";

const SavedJobs = () => {
  const { token } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/saved-jobs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedJobs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const unsaveJob = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/saved-jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedJobs(savedJobs.filter(sj => sj._id !== id));
      toast.success("Job removed from bookmarks");
    } catch (err) {
      toast.error("Failed to remove bookmark");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <header className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-block p-4 bg-blue-50 text-blue-600 rounded-3xl mb-4">
          <Bookmark size={32} />
        </div>
        <h1 className="text-4xl font-black text-gray-900">Saved Opportunities</h1>
        <p className="text-gray-500 mt-2">Manage all the positions you've bookmarked for later application.</p>
      </header>

      <div className="max-w-4xl mx-auto space-y-4">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : savedJobs.length > 0 ? (
          savedJobs.map((item) => (
            <div key={item._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group flex justify-between items-center transition hover:shadow-xl hover:shadow-blue-50">
              <div className="flex gap-6 items-center">
                <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                  {item.job.employer?.companyLogo ? (
                    <img src={item.job.employer.companyLogo} alt="Logo" className="h-full w-full object-cover" />
                  ) : item.job.title[0]}
                </div>
                <div>
                  <Link to={`/jobs/${item.job._id}`}>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">{item.job.title}</h3>
                  </Link>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500 font-medium">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {item.job.employer?.name}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {item.job.category}</span>
                    <span className="flex items-center gap-1 text-green-600"><DollarSign size={14} /> ${item.job.budget}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Link to={`/jobs/${item.job._id}`} className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-600 transition shadow-lg shadow-gray-100">
                  Apply Now
                </Link>
                <button 
                  onClick={() => unsaveJob(item._id)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition"
                  title="Remove Bookmark"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Star size={64} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No saved jobs yet</h3>
            <p className="text-gray-400 mt-2">Explore the job board and bookmark positions that match your skills.</p>
            <Link to="/jobs" className="inline-block mt-6 text-blue-600 font-bold hover:underline">Browse Jobs</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
