"use client";

import { IBlog } from "@/interfaces/blogs";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  ExternalLink,
  ChevronRight,
  Clock,
  Calendar,
  Search,
  Filter,
  Hash,
  Tag
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import AdminEditor from "@/components/admin/AdminEditor";
import toast from "react-hot-toast";



import { 
  getBlogs, 
  createBlog, 
  updateBlog, 
  deleteBlog 
} from "@/lib/actions/blogs";

function BlogEditorInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("id");
  
const [blogs, setBlogs] = useState<IBlog[]>([]);
const [form, setForm] = useState<Partial<IBlog>>({ 
    title: "", 
    excerpt: "", 
    content: "", 
    readTime: "5 min read", 
    image: "" 
  });
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"list" | "editor">("list");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBlogs = useCallback(async () => {
    try {
      const data = await getBlogs();
      setBlogs(data as any[]);
    } catch {
      toast.error("Failed to fetch blogs");
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    if (editId) {
      const blog = blogs.find(b => b._id === editId);
      if (blog) {
        setForm(blog);
        setView("editor");
      }
    } else if (searchParams.get("new")) {
      setForm({ title: "", excerpt: "", content: "", readTime: "5 min read", image: "" });
      setView("editor");
    }
  }, [editId, blogs, searchParams]);

  const handleSave = async () => {
    if (!form.title || !form.content) {
      toast.error("Title and content are required.");
      return;
    }
    
    setSaving(true);
    try {
      const isEdit = !!form._id;
      let result: any;
      
      if (isEdit) {
        result = await updateBlog(form._id!, form);
        setBlogs(bs => bs.map(b => b._id === form._id ? result : b));
      } else {
        result = await createBlog(form);
        setBlogs(bs => [result, ...bs]);
        setForm(result);
        router.push(`/admin/blog-editor?id=${result._id}`, { scroll: false });
      }
      
      toast.success(isEdit ? "Blog updated!" : "Blog published!");
      setView("list");
    } catch {
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) return;
    
    try {
      await deleteBlog(id);
      setBlogs(bs => bs.filter(b => b._id !== id));
      toast.success("Blog post deleted");
      if (form._id === id) setView("list");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (b.excerpt ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Enhanced Visuals */}
      <div className="fixed left-0 top-0 bottom-0 w-72 bg-surface-low/30 backdrop-blur-xl border-r border-outline/10 flex flex-col z-40 p-8">
        <Link href="/admin" className="group flex items-center gap-3 font-display text-[10px] uppercase tracking-[0.2em] text-foreground/30 hover:text-primary transition-all mb-12">
          <div className="w-6 h-6 rounded-full bg-surface-high flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <ArrowLeft size={12} />
          </div>
          Dashboard
        </Link>
        
        <div className="mb-10">
          <h2 className="font-display font-black text-2xl tracking-tighter text-foreground">Blog Vault</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <p className="font-display text-[10px] uppercase tracking-widest text-foreground/30">{blogs.length} Total Posts</p>
          </div>
        </div>

        <button 
          onClick={() => {
            setForm({ title: "", excerpt: "", content: "", readTime: "5 min read", image: "" });
            setView("editor");
            router.push("/admin/blog-editor?new=true", { scroll: false });
          }}
          className="flex items-center justify-center gap-3 bg-primary text-surface-lowest px-6 py-4 rounded-xl font-display font-bold text-[10px] uppercase tracking-widest mb-10 hover:shadow-[0_0_30px_-5px_rgba(var(--primary-rgb),0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={14} strokeWidth={3} /> New Masterpiece
        </button>

        <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
          {blogs.map(b => (
            <button 
              key={b._id} 
              onClick={() => {
                setForm(b);
                setView("editor");
                router.push(`/admin/blog-editor?id=${b._id}`, { scroll: false });
              }}
              className={`w-full group text-left px-4 py-4 rounded-xl transition-all duration-300 ${form._id === b._id && view === "editor" ? "bg-surface-high border-l-4 border-primary pl-5" : "hover:bg-surface-high/50 border-l-4 border-transparent"}`}
            >
              <p className={`font-display font-bold text-xs truncate transition-colors ${form._id === b._id && view === "editor" ? "text-primary" : "text-foreground/70"}`}>
                {b.title || "Untitled Draft"}
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <p className="font-display text-[8px] text-foreground/30 uppercase tracking-widest">{b.readTime}</p>
                <div className="w-1 h-1 rounded-full bg-foreground/10" />
                <p className="font-display text-[8px] text-foreground/30 uppercase tracking-widest">
                  {b.updatedAt ? new Date(b.updatedAt).toLocaleDateString() : "Draft"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <main className="ml-0 p-12 lg:p-16">
        {view === "list" ? (
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tighter mb-4">Editorial Archive</h1>
                <p className="font-body text-foreground/40 max-w-lg">Manage your thoughts, tutorials, and insights from this central hub.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={16} />
                  <input 
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 pr-6 py-3 bg-surface-low/50 border border-outline/10 rounded-xl font-body text-sm focus:outline-none focus:border-primary/50 transition-all w-64"
                  />
                </div>
                <button className="p-3 bg-surface-low/50 border border-outline/10 rounded-xl text-foreground/40 hover:text-primary transition-colors">
                  <Filter size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredBlogs.length === 0 ? (
                <GlassCard className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-surface-high flex items-center justify-center mb-6">
                    <Search className="text-foreground/20" size={32} />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-2">No posts found</h3>
                  <p className="font-body text-foreground/40">Try adjusting your search or create a new post.</p>
                </GlassCard>
              ) : filteredBlogs.map(b => (
                <GlassCard key={b._id} className="group flex flex-col md:flex-row items-center gap-8 p-6 hover:border-primary/20 transition-all duration-500">
                  <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-surface-high flex-shrink-0 relative">
                    {b.image ? (
                      <img src={b.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-foreground/10">
                        <ImageIcon size={32} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="px-2 py-0.5 rounded text-[8px] font-display font-black uppercase tracking-[0.1em] bg-primary/10 text-primary">Published</span>
                       <span className="font-display text-[9px] text-foreground/30 uppercase tracking-widest flex items-center gap-1.5">
                         <Clock size={10} /> {b.readTime}
                       </span>
                    </div>
                    <h3 className="font-display font-black text-xl lg:text-2xl tracking-tight group-hover:text-primary transition-colors truncate">{b.title}</h3>
                    <p className="font-body text-sm text-foreground/40 mt-2 line-clamp-2 leading-relaxed">{b.excerpt}</p>
                    
                    <div className="flex items-center gap-4 mt-6">
                       <div className="flex items-center gap-1.5 text-foreground/30">
                         <Calendar size={12} />
                         <span className="font-display text-[9px] uppercase tracking-widest font-bold">
                           {b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                         </span>
                       </div>
                    </div>
                  </div>
                  
                  <div className="flex md:flex-col gap-2 w-full md:w-auto">
                    <button 
                      onClick={() => {
                        setForm(b);
                        setView("editor");
                        router.push(`/admin/blog-editor?id=${b._id}`, { scroll: false });
                      }} 
                      className="flex-1 md:flex-none p-3 rounded-xl bg-surface-high/50 hover:bg-primary hover:text-surface-lowest transition-all group/btn"
                      title="Edit Post"
                    >
                      <Save size={18} className="mx-auto" />
                    </button>
                    <button 
                      onClick={() => b._id && handleDelete(b._id)} 
                      className="flex-1 md:flex-none p-3 rounded-xl bg-surface-high/50 hover:bg-error/10 hover:text-error transition-all"
                      title="Delete Post"
                    >
                      <Trash2 size={18} className="mx-auto" />
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Editor Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => {
                    setView("list");
                    router.push("/admin/blog-editor", { scroll: false });
                  }} 
                  className="w-10 h-10 rounded-full border border-outline/10 flex items-center justify-center hover:bg-surface-high transition-all"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h1 className="font-display text-3xl font-black tracking-tighter">{form._id ? "Refine Post" : "Draft New Post"}</h1>
                  <p className="font-body text-xs text-foreground/30 mt-1 uppercase tracking-[0.1em]">Markdown & HTML Professional Editor</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setForm({ ...form })} // Simple refresh to trigger preview
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-high/50 border border-outline/10 font-display text-[10px] uppercase font-bold tracking-widest hover:bg-surface-high transition-all"
                >
                  <Clock size={14} /> Drafts
                </button>
                <button 
                  onClick={() => handleSave()} 
                  disabled={saving} 
                  className="flex items-center gap-2 bg-primary text-surface-lowest px-8 py-3 rounded-xl font-display font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_0_30px_-5px_rgba(var(--primary-rgb),0.5)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {saving ? <div className="w-4 h-4 border-2 border-surface-lowest/30 border-t-surface-lowest rounded-full animate-spin" /> : <Save size={14} />} 
                  {saving ? "Publishing..." : "Publish Post"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/30 pl-1">Article Title</label>
                  <input 
                    value={form.title} 
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full bg-surface-low/30 border-b border-outline/20 px-0 py-4 font-display font-black text-3xl lg:text-4xl focus:outline-none focus:border-primary transition-all placeholder:text-foreground/10"
                    placeholder="Enter a compelling title..." 
                  />
                </div>

                <div className="space-y-3">
                  <AdminEditor 
                    label="Article Content"
                    value={form.content ?? ""}
                    onChange={(val) => setForm(f => ({ ...f, content: val }))}
                    id="blog-main-editor"
                  />
                </div>
              </div>

              <div className="space-y-8">
                <GlassCard className="p-8 space-y-8 border-outline/15 shadow-xl">
                  {/* Metadata Sidebar */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/30 mb-3 pl-1">Cover Image</label>
                      <div className="relative group">
                         <div className="aspect-video w-full rounded-2xl bg-surface-high overflow-hidden border border-outline/10">
                           {form.image ? (
                             <img src={form.image} alt="" className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-foreground/10">
                               <ImageIcon size={32} />
                               <span className="font-display text-[9px] uppercase font-bold">No Image Selected</span>
                             </div>
                           )}
                         </div>
                         <input 
                           value={form.image} 
                           onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                           className="mt-3 w-full bg-surface-high/30 border border-outline/10 rounded-xl px-4 py-3 font-body text-xs focus:outline-none focus:border-primary transition-all placeholder:text-foreground/20"
                           placeholder="External URL (Unsplash, Cloudinary...)" 
                         />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/30 mb-3 pl-1">Read Time</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={14} />
                        <input 
                          value={form.readTime} 
                          onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))}
                          className="w-full bg-surface-high/30 border border-outline/10 rounded-xl pl-11 pr-4 py-3 font-body text-xs focus:outline-none focus:border-primary transition-all"
                          placeholder="5 min read" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/30 mb-3 pl-1">Excerpt</label>
                      <textarea 
                        value={form.excerpt} 
                        onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} 
                        rows={5}
                        className="w-full bg-surface-high/30 border border-outline/10 rounded-xl px-5 py-4 font-body text-xs focus:outline-none focus:border-primary transition-all resize-none leading-relaxed placeholder:text-foreground/20"
                        placeholder="Provide a brief summary for the preview card..." 
                      />
                    </div>
                  </div>

                  <div className="pt-8 border-t border-outline/10">
                    <p className="text-[9px] uppercase tracking-widest text-foreground/20 font-bold mb-4 flex items-center gap-2">
                       <CheckCircle2 size={12} className="text-green-500/50" /> Publishing Checklist
                    </p>
                    <ul className="space-y-3">
                       <li className={`flex items-center gap-3 text-[10px] font-display font-bold transition-colors ${form.title ? 'text-foreground/60' : 'text-foreground/20'}`}>
                         <div className={`w-1.5 h-1.5 rounded-full ${form.title ? 'bg-green-500' : 'bg-surface-high'}`} /> Title set
                       </li>
                       <li className={`flex items-center gap-3 text-[10px] font-display font-bold transition-colors ${form.content ? 'text-foreground/60' : 'text-foreground/20'}`}>
                         <div className={`w-1.5 h-1.5 rounded-full ${form.content ? 'bg-green-500' : 'bg-surface-high'}`} /> Content written
                       </li>
                       <li className={`flex items-center gap-3 text-[10px] font-display font-bold transition-colors ${form.image ? 'text-foreground/60' : 'text-foreground/20'}`}>
                         <div className={`w-1.5 h-1.5 rounded-full ${form.image ? 'bg-green-500' : 'bg-surface-high'}`} /> Image attached
                       </li>
                    </ul>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--outline);
          opacity: 0.1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--primary);
        }
      `}</style>
    </div>
  );
}

const CheckCircle2 = ({ size, className }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
  </svg>
);

export default function BlogEditorPage() {
  return <Suspense><BlogEditorInner /></Suspense>;
}
