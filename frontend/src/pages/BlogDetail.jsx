import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, User, ChevronLeft, Calendar, Tag, Share2, MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "../utils/api";
import Footer from "../components/Footer";
import { toast } from "react-toastify";


const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        setPost(res.data.data);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (isLoading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 transition-colors duration-500">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-900 transition-colors duration-500 p-8">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">Blog Not Found</h2>
        <Link to="/blog" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-500 transition shadow-xl shadow-indigo-500/20">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] flex flex-col pt-24 transition-colors duration-500">
      <div className="flex-1 max-w-4xl mx-auto px-6 pb-12 pt-6 md:pb-20 md:pt-10">

        {/* Navigation & Header */}
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold uppercase tracking-widest text-xs mb-10 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Insights
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest rounded-full border border-indigo-500/20">
              {post.category}
            </span>
            <div className="h-1 w-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">
              <Clock size={12} /> {new Date(post.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight mb-8">
            {post.title}
          </h1>

          <div className="flex items-center justify-between py-8 border-y border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <User size={24} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">Author</p>
                <p className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">{post.author}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <button 
                 onClick={handleShare}
                 className="p-3 text-slate-400 hover:text-indigo-500 transition-colors"
                 title="Share this article"
               >
                  <Share2 size={20} />
               </button>
            </div>

          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl mb-16 border border-slate-100 dark:border-slate-800">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-auto object-cover max-h-[500px]"
          />
        </div>

        {/* Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none prose-slate prose-headings:font-black prose-headings:tracking-tighter prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-strong:text-slate-900 dark:prose-strong:text-white prose-img:rounded-3xl">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>

        {/* Footer of article */}
        <div className="mt-20 pt-12 border-t border-slate-100 dark:border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-3">
              <Tag size={16} className="text-indigo-500" />
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Industry Trends</span>
           </div>
           <div className="flex gap-4">
              <Link 
                to="/blog" 
                className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Explore More Articles
              </Link>
           </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetail;
