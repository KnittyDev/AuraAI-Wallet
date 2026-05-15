"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LuPlus, 
  LuNewspaper, 
  LuTrash2, 
  LuPencil, 
  LuSearch, 
  LuImage, 
  LuLink, 
  LuTag,
  LuExternalLink,
  LuLoader,
  LuX,
  LuSave
} from "react-icons/lu";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => <div className="h-64 w-full bg-white/5 animate-pulse rounded-2xl border border-white/10" />
});

interface NewsArticle {
  id: string;
  title: string;
  body: string;
  source: string;
  image_url: string;
  category: string;
  external_url: string;
  created_at: string;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    source: "AuraAI Official",
    image_url: "",
    category: "Market",
    external_url: ""
  });

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  }), []);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/admin/news", {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      const data = await res.json();
      
      if (!res.ok) {
        console.error("News API Error:", data);
        alert(`Error: ${data.error || "Failed to fetch news"}`);
        return;
      }

      if (Array.isArray(data)) {
        setNews(data);
      } else {
        console.error("News API returned non-array:", data);
      }
    } catch (err) {
      console.error("Fetch news error:", err);
      alert("A network error occurred while fetching news.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (article: NewsArticle | null = null) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title,
        body: article.body,
        source: article.source,
        image_url: article.image_url,
        category: article.category,
        external_url: article.external_url
      });
    } else {
      setEditingArticle(null);
      setFormData({
        title: "",
        body: "",
        source: "AuraAI Official",
        image_url: "",
        category: "Market",
        external_url: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const method = editingArticle ? "PUT" : "POST";
      const res = await fetch("/api/admin/news", {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}` 
        },
        body: JSON.stringify(editingArticle ? { ...formData, id: editingArticle.id } : formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchNews();
      }
    } catch (err) {
      console.error("Save news error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file.");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `articles/${fileName}`;

      const { data, error } = await supabase.storage
        .from('news-images')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('news-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/admin/news?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      if (res.ok) fetchNews();
    } catch (err) {
      console.error("Delete news error:", err);
    }
  };

  const filteredNews = news.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      <AdminSidebar currentPath="/admin/news" />
      
      <section className="relative z-10 flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <LuNewspaper className="h-8 w-8 text-white/40" />
                <h1 className="text-4xl font-bold tracking-tight">Market News</h1>
              </div>
              <p className="text-white/50">Create and manage insights for your users.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative group">
                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-white/60 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-white/20 transition-all w-full md:w-64"
                />
              </div>
              <button 
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl text-sm font-bold hover:bg-white/90 transition shadow-lg shadow-white/5"
              >
                <LuPlus className="h-4 w-4" />
                <span>New Article</span>
              </button>
            </div>
          </header>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <LuLoader className="h-10 w-10 animate-spin text-white/20" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((article) => (
                <motion.article 
                  key={article.id}
                  layout
                  className="group relative rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-white/20 transition-all duration-300"
                >
                  {article.image_url && (
                    <div className="h-48 w-full relative overflow-hidden">
                      <img src={article.image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white">
                          {article.category}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 line-clamp-2 leading-tight group-hover:text-cyan-400 transition-colors">{article.title}</h3>
                    <div className="flex items-center gap-2 text-white/40 text-xs mb-6">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleOpenModal(article)}
                          className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/5 text-white/60 hover:bg-white/20 transition-colors"
                        >
                          <LuPencil className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(article.id)}
                          className="h-9 w-9 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <LuTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <a href={article.external_url || "#"} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
                        <LuExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Article Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[40px] border border-white/15 bg-[#0a0a0a] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{editingArticle ? "Edit Article" : "New News Article"}</h2>
                  <p className="text-sm text-white/40">Fill in the details below to publish.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition">
                  <LuX className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Article Title</label>
                    <input 
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-white/30 transition-all"
                      placeholder="Enter a catchy headline..."
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Source Name</label>
                    <div className="relative">
                      <LuNewspaper className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                      <input 
                        value={formData.source}
                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-13 pr-5 py-4 text-white outline-none focus:border-white/30 transition-all"
                        placeholder="e.g., Bloomberg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Category</label>
                    <div className="relative">
                      <LuTag className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-13 pr-5 py-4 text-white outline-none focus:border-white/30 transition-all appearance-none"
                      >
                        <option value="Market" className="bg-black">Market</option>
                        <option value="Crypto" className="bg-black">Crypto</option>
                        <option value="Analysis" className="bg-black">Analysis</option>
                        <option value="Update" className="bg-black">Update</option>
                      </select>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Article Image</label>
                    <div className="flex flex-col gap-4">
                      {formData.image_url && (
                        <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-white/10 group">
                          <img 
                            src={formData.image_url} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                          <button 
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                            className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <LuX className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                      <div className="relative">
                        <input 
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                        <label 
                          htmlFor="image-upload"
                          className={`flex items-center justify-center gap-3 w-full bg-white/5 border-2 border-dashed border-white/10 rounded-2xl px-5 py-8 text-white cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {uploading ? (
                            <>
                              <LuLoader className="h-6 w-6 animate-spin text-white/40" />
                              <span className="text-sm font-medium text-white/40 tracking-wide uppercase">Uploading...</span>
                            </>
                          ) : (
                            <>
                              <LuImage className="h-6 w-6 text-white/40" />
                              <div className="text-center">
                                <span className="block text-sm font-bold mb-1">Click to upload image</span>
                                <span className="block text-xs text-white/30">PNG, JPG, WEBP up to 5MB</span>
                              </div>
                            </>
                          )}
                        </label>
                      </div>
                      
                      <div className="relative group">
                        <LuLink className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                        <input 
                          value={formData.image_url}
                          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-13 pr-5 py-4 text-white outline-none focus:border-white/30 transition-all"
                          placeholder="Or paste image URL here..."
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">External Link (Optional)</label>
                    <div className="relative">
                      <LuLink className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                      <input 
                        value={formData.external_url}
                        onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-13 pr-5 py-4 text-white outline-none focus:border-white/30 transition-all"
                        placeholder="https://news-source.com/..."
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Article Content</label>
                    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden quill-custom">
                      <ReactQuill 
                        theme="snow"
                        value={formData.body}
                        onChange={(val) => setFormData({ ...formData, body: val })}
                        modules={modules}
                        className="text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 pb-2">
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition disabled:opacity-50"
                  >
                    {isSaving ? <LuLoader className="h-5 w-5 animate-spin" /> : <LuSave className="h-5 w-5" />}
                    <span>{editingArticle ? "Update Article" : "Publish Article"}</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .quill-custom .ql-container {
          min-height: 300px;
          border: none !important;
          font-family: inherit;
          font-size: 16px;
        }
        .quill-custom .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid rgba(255,255,255,0.1) !important;
          background: rgba(255,255,255,0.02);
        }
        .quill-custom .ql-editor {
          padding: 20px;
        }
        .quill-custom .ql-stroke {
          stroke: rgba(255,255,255,0.6) !important;
        }
        .quill-custom .ql-fill {
          fill: rgba(255,255,255,0.6) !important;
        }
        .quill-custom .ql-picker {
          color: rgba(255,255,255,0.6) !important;
        }
        .quill-custom .ql-picker-options {
          background-color: #111 !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
      `}</style>
    </main>
  );
}
