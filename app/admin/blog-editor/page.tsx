"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Plus, Image as ImageIcon, Eye } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import toast from "react-hot-toast";

interface Blog {
  _id?: string; title: string; excerpt: string; content: string; readTime: string; image: string; createdAt?: string;
}

function BlogEditorInner() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isNew = !editId;

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [form, setForm] = useState<Blog>({ title: "", excerpt: "", content: "", readTime: "5 min read", image: "" });
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"list" | "editor">(isNew ? "editor" : "list");
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    fetch("/api/admin/blogs").then(r => r.json()).then(d => { if (Array.isArray(d.blogs)) setBlogs(d.blogs); });
  }, []);

  useEffect(() => {
    if (editId) {
      const blog = blogs.find(b => b._id === editId);
      if (blog) { setForm(blog); setView("editor"); }
    }
  }, [editId, blogs]);

  const handleSave = async () => {
    if (!form.title || !form.content) return toast.error("Title and content are required.");
    setSaving(true);
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `/api/admin/blogs?id=${editId}` : "/api/admin/blogs";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (editId) { setBlogs(bs => bs.map(b => b._id === editId ? data.blog : b)); }
      else { setBlogs(bs => [data.blog, ...bs]); setForm({ title: "", excerpt: "", content: "", readTime: "5 min read", image: "" }); }
      toast.success(editId ? "Blog updated!" : "Blog published!");
      setView("list");
    } catch { toast.error("Failed to save."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    const res = await fetch(`/api/admin/blogs?id=${id}`, { method: "DELETE" });
    if (res.ok) { setBlogs(bs => bs.filter(b => b._id !== id)); toast.success("Deleted."); }
    else { toast.error("Failed to delete."); }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-surface-low border-r border-outline/10 flex flex-col z-40 p-6">
        <Link href="/admin" className="flex items-center gap-2 font-display text-[10px] uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors mb-8">
          <ArrowLeft size={12} /> Dashboard
        </Link>
        <div className="mb-8">
          <p className="font-display font-black text-lg tracking-tight">Blog Editor</p>
          <p className="font-display text-[9px] uppercase tracking-widest text-foreground/35 mt-1">{blogs.length} posts</p>
        </div>
        <button onClick={() => { setForm({ title: "", excerpt: "", content: "", readTime: "5 min read", image: "" }); setView("editor"); }}
          className="flex items-center gap-2 bg-primary text-surface-lowest px-4 py-2.5 rounded-lg font-display font-bold text-[10px] uppercase tracking-widest mb-6 hover:opacity-90 transition-opacity">
          <Plus size={13} /> New Post
        </button>
        <div className="flex-1 space-y-1 overflow-y-auto">
          {blogs.map(b => (
            <button key={b._id} onClick={() => { setForm(b); setView("editor"); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg hover:bg-background/60 transition-all ${form._id === b._id && view === "editor" ? "bg-background/60 border border-outline/10" : ""}`}>
              <p className="font-display font-bold text-xs truncate">{b.title || "Untitled"}</p>
              <p className="font-display text-[9px] text-foreground/35 mt-0.5 uppercase tracking-widest">{b.readTime}</p>
            </button>
          ))}
        </div>
      </div>

      <main className="ml-64 p-10">
        {view === "list" ? (
          <div className="max-w-4xl">
            <h1 className="font-display text-3xl font-black tracking-tighter mb-8">All Blog Posts</h1>
            <div className="space-y-4">
              {blogs.length === 0 ? (
                <GlassCard><p className="font-body text-foreground/40 text-sm">No posts yet. Create your first blog post.</p></GlassCard>
              ) : blogs.map(b => (
                <GlassCard key={b._id} className="flex items-center gap-6">
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-lg">{b.title}</h3>
                    <p className="font-body text-sm text-foreground/50 mt-1 line-clamp-2">{b.excerpt}</p>
                    <p className="font-display text-[9px] uppercase tracking-widest text-foreground/30 mt-2">{b.readTime}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setForm(b); setView("editor"); }} className="p-2.5 rounded-lg hover:bg-surface-high transition-colors" title="Edit"><Save size={15} /></button>
                    <button onClick={() => b._id && handleDelete(b._id)} className="p-2.5 rounded-lg hover:bg-error/10 text-error transition-colors" title="Delete"><Trash2 size={15} /></button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl">
            {/* Editor Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button onClick={() => setView("list")} className="flex items-center gap-2 font-display text-[9px] uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors">
                  <ArrowLeft size={12} /> Back
                </button>
                <h1 className="font-display text-2xl font-black tracking-tighter">{form._id ? "Edit Post" : "New Post"}</h1>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setPreview(p => !p)} className="flex items-center gap-2 border border-outline/20 px-4 py-2 rounded-lg font-display text-[9px] uppercase tracking-widest hover:bg-surface-high transition-all">
                  <Eye size={13} /> {preview ? "Edit" : "Preview"}
                </button>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-primary text-surface-lowest px-5 py-2 rounded-lg font-display font-bold text-[9px] uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-60">
                  <Save size={13} /> {saving ? "Saving..." : "Publish"}
                </button>
              </div>
            </div>

            {preview ? (
              <GlassCard>
                {form.image && <img src={form.image} alt="cover" className="w-full h-48 object-cover rounded-lg mb-6" />}
                <h2 className="font-display text-3xl font-black tracking-tighter mb-4">{form.title || "Untitled"}</h2>
                <p className="font-body text-foreground/55 mb-6 text-lg">{form.excerpt}</p>
                <div className="font-body text-foreground/70 leading-relaxed whitespace-pre-wrap">{form.content}</div>
              </GlassCard>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="block font-display text-[9px] uppercase tracking-widest text-foreground/40 font-bold mb-2">Cover Image URL</label>
                  <div className="flex gap-3">
                    <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                      className="flex-1 bg-surface-high/60 border border-outline/15 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/25"
                      placeholder="https://images.unsplash.com/..." />
                    <div className="w-12 h-12 bg-surface-high rounded-xl flex items-center justify-center text-foreground/30 overflow-hidden">
                      {form.image ? <img src={form.image} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={16} />}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block font-display text-[9px] uppercase tracking-widest text-foreground/40 font-bold mb-2">Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full bg-surface-high/60 border border-outline/15 rounded-xl px-4 py-4 font-display font-black text-2xl focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/20"
                    placeholder="Write your post title..." />
                </div>
                <div>
                  <label className="block font-display text-[9px] uppercase tracking-widest text-foreground/40 font-bold mb-2">Excerpt</label>
                  <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={3}
                    className="w-full bg-surface-high/60 border border-outline/15 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/25 resize-none"
                    placeholder="Short summary shown in the post listing..." />
                </div>
                <div>
                  <label className="block font-display text-[9px] uppercase tracking-widest text-foreground/40 font-bold mb-2">Read Time</label>
                  <input value={form.readTime} onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))}
                    className="w-48 bg-surface-high/60 border border-outline/15 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="5 min read" />
                </div>
                <div>
                  <label className="block font-display text-[9px] uppercase tracking-widest text-foreground/40 font-bold mb-2">Content *</label>
                  <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={24}
                    className="w-full bg-surface-high/60 border border-outline/15 rounded-xl px-5 py-4 font-body text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/25 resize-none leading-relaxed"
                    placeholder="Write your article content here..." />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function BlogEditorPage() {
  return <Suspense><BlogEditorInner /></Suspense>;
}
