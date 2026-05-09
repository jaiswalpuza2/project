import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, User, ChevronRight, Search, Tag, Sparkles, Loader2 } from "lucide-react";

import { toast } from "react-toastify";
import api from "../utils/api";
import Footer from "../components/Footer";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blogs");
        setPosts(res.data.data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribing(true);
    try {
      const res = await api.post("/blogs/subscribe", { email });
      toast.success(res.data.message || "Subscribed successfully!");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to subscribe");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] flex flex-col pt-24 transition-colors duration-500">
      <div className="flex-1 max-w-7xl mx-auto px-8 pb-16 pt-8">

        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">

            <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 transition-colors">
              Our Latest <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-500">Stories</span>
            </h1>
            <p className="text-2xl text-slate-600 dark:text-slate-300 font-medium max-w-3xl leading-relaxed transition-colors">
              Expert advice, industry trends, and success stories to fuel your professional journey.
            </p>
          </div>
          <div className="w-full md:w-auto">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-slate-900 dark:text-white text-base font-bold focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all w-full md:w-80 shadow-inner transition-colors"
                />
             </div>
          </div>
        </div>


        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 animate-pulse transition-colors">
                <div className="aspect-video bg-slate-100 dark:bg-slate-800 transition-colors" />
                <div className="p-8">
                  <div className="flex gap-4 mb-4">
                    <div className="h-6 w-24 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors" />
                    <div className="h-6 w-24 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors" />
                  </div>
                  <div className="h-8 w-full bg-slate-100 dark:bg-slate-800 rounded-lg mb-4 transition-colors" />
                  <div className="h-8 w-2/3 bg-slate-100 dark:bg-slate-800 rounded-lg mb-6 transition-colors" />
                  <div className="h-20 w-full bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
            {filteredPosts.map((post, i) => (
              <article key={i} className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-violet-500/30 transition-all group shadow-xl dark:shadow-2xl transition-colors">

                <Link to={`/blog/${post._id}`}>
                  <div className="aspect-video overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-black uppercase tracking-widest rounded-full border border-violet-500/20 transition-colors">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest transition-colors">
                        <Clock size={12} /> {new Date(post.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors tracking-tight transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-base font-medium leading-relaxed mb-6 line-clamp-3 transition-colors">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/50 transition-colors">
                       <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors">
                             <User size={16} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider transition-colors">{post.author}</span>
                       </div>
                       <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white group-hover:bg-violet-600 group-hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-violet-500/20 transition-colors">
                          <ChevronRight size={20} />
                       </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-12 text-center md:flex md:items-center md:justify-between md:text-left gap-8 shadow-xl transition-colors">
           <div>
             <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight transition-colors">Stay ahead of the curve</h3>
             <p className="text-slate-600 dark:text-slate-300 font-medium tracking-tight text-lg transition-colors">Get the best of JobSphere insights delivered to your inbox weekly.</p>
           </div>
           <form onSubmit={handleSubscribe} className="mt-8 md:mt-0 flex flex-col sm:flex-row gap-4 w-full md:w-auto transition-colors">
             <input 
              type="email" 
              placeholder="email@address.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-6 text-slate-900 dark:text-white text-base font-bold focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all sm:w-64 transition-colors" 
              required
             />
             <button 
              type="submit"
              disabled={isSubscribing}
              className="bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest px-8 py-4 rounded-2xl transition shadow-xl shadow-violet-500/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
             >
               {isSubscribing ? <Loader2 className="animate-spin" size={20} /> : "Subscribe"}
             </button>
           </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
