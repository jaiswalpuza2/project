import React, { useState, useEffect } from "react";
import { Clock, User, ChevronRight, Search, Tag, Sparkles, Loader2 } from "lucide-react";
import axios from "axios";
import Footer from "../components/Footer";


const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs");
        setPosts(res.data.data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);


  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col pt-24">
      <div className="flex-1 max-w-7xl mx-auto px-8 py-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 mb-6 bg-violet-500/10 px-6 py-2 rounded-full border border-violet-500/20">
              <Sparkles size={18} className="text-violet-400" />
              <span className="text-violet-400 font-black uppercase tracking-widest text-sm">JobSphere Insights</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4">
              Our Latest <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-500">Stories</span>
            </h1>
            <p className="text-2xl text-slate-300 font-medium max-w-3xl leading-relaxed">
              Expert advice, industry trends, and success stories to fuel your professional journey.
            </p>
          </div>
          <div className="w-full md:w-auto">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  className="bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-white text-base font-bold focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all w-full md:w-80 shadow-inner"
                />
             </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 animate-pulse">
                <div className="aspect-video bg-slate-800" />
                <div className="p-8">
                  <div className="flex gap-4 mb-4">
                    <div className="h-6 w-24 bg-slate-800 rounded-full" />
                    <div className="h-6 w-24 bg-slate-800 rounded-full" />
                  </div>
                  <div className="h-8 w-full bg-slate-800 rounded-lg mb-4" />
                  <div className="h-8 w-2/3 bg-slate-800 rounded-lg mb-6" />
                  <div className="h-20 w-full bg-slate-800 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20 text-white">
            {posts.map((post, i) => (
              <article key={i} className="bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 hover:border-violet-500/30 transition-all group shadow-2xl">
                <div className="aspect-video overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-violet-500/10 text-violet-400 text-xs font-black uppercase tracking-widest rounded-full border border-violet-500/20">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-black uppercase tracking-widest">
                      <Clock size={12} /> {new Date(post.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>

                  </div>
                  <h3 className="text-3xl font-black text-white mb-4 line-clamp-2 group-hover:text-violet-400 transition-colors tracking-tight">
                    {post.title}
                  </h3>
                  <p className="text-slate-300 text-base font-medium leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                     <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center text-slate-400">
                          <User size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">{post.author}</span>
                     </div>
                     <button className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-white hover:bg-violet-600 transition-colors group-hover:shadow-lg group-hover:shadow-violet-500/20">
                        <ChevronRight size={20} />
                     </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 text-center md:flex md:items-center md:justify-between md:text-left gap-8">
           <div>
             <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Stay ahead of the curve</h3>
             <p className="text-slate-300 font-medium tracking-tight text-lg">Get the best of JobSphere insights delivered to your inbox weekly.</p>
           </div>
           <div className="mt-8 md:mt-0 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
             <input type="email" placeholder="email@address.com" className="bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-white text-base font-bold focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all sm:w-64" />
             <button className="bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest px-8 py-4 rounded-2xl transition shadow-xl shadow-violet-500/20 text-sm">
               Subscribe
             </button>
           </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
