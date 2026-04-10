"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Plus, Image as ImageIcon, Eye } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import toast from "react-hot-toast";

interface CaseStudy {
  _id?: string; title: string; category: string; summary: string; content: string; outcome: string; image: string; createdAt?: string;
}

function CaseStudyEditorInner() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [form, setForm] = useState<CaseStudy>({ title: "", category: "", summary: "", content: "", outcome: "", image: "" });
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"list" | "editor">("list");
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    fetch("/api/admin/case-studies").then(r => r.json()).then(d => { if (Array.isArray(d.caseStudies)) setStudies(d.caseStudies); });
  }, []);

  useEffect(() => {
    if (editId) {
      const cs = studies.find(s => s._id === editId);
      if (cs) { setForm(cs); setView("editor"); }
    }
  }, [editId, studies]);

  const handleSave = async () => {
    if (!form.title || !form.content) return toast.error("Title and content are required.");
    setSaving(true);
    try {
      const method = form._id ? "PUT" : "POST";
      const url = form._id ? `/api/admin/case-studies?id=${form._id}` : "/api/admin/case-studies";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (form._id) { setStudies(ss => ss.map(s => s._id === form._id ? data.caseStudy : s)); }
      else { setStudies(ss => [data.caseStudy, ...ss]); setForm({ title: "", category: "", summary: "", content: "", outcome: "", image: "" }); }
      toast.success(form._id ? "Case study updated!" : "Case study published!");
      setView("list");
    } catch { toast.error("Failed to save."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this case study?")) return;
    const res = await fetch(`/api/admin/case-studies?id=${id}`, { method: "DELETE" });
    if (res.ok) { setStudies(ss => ss.filter(s => s._id !== id)); toast.success("Deleted."); }
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
          <p className="font-display font-black text-lg tracking-tight">Case Study Editor</p>
          <p className="font-display text-[9px] uppercase tracking-widest text-foreground/35 mt-1">{studies.length} studies</p>
        </div>
        <button onClick={() => { setForm({ title: "", category: "", summary: "", content: "", outcome: "", image: "" }); setView("editor"); }}
          className="flex items-center gap-2 bg-primary text-surface-lowest px-4 py-2.5 rounded-lg font-display font-bold text-[10px] uppercase tracking-widest mb-6 hover:opacity-90 transition-opacity">
          <Plus size={13} /> New Study
        </button>
        <div className="flex-1 space-y-1 overflow-y-auto">
          {studies.map(s => (
            <button key={s._id} onClick={() => { setForm(s); setView("editor"); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg hover:bg-background/60 transition-all ${form._id === s._id && view === "editor" ? "bg-background/60 border border-outline/10" : ""}`}>
              <p className="font-display font-bold text-xs truncate">{s.title || "Untitled"}</p>
              <p className="font-display text-[9px] text-foreground/35 mt-0.5 uppercase tracking-widest">{s.category}</p>
            </button>
          ))}
        </div>
      </div>

      <main className="ml-64 p-10">
        {view === "list" ? (
          <div className="max-w-4xl">
            <h1 className="font-display text-3xl font-black tracking-tighter mb-8">All Case Studies</h1>
            <div className="space-y-4">
              {studies.length === 0 ? (
                <GlassCard><p className="font-body text-foreground/40 text-sm">No case studies yet. Create your first one.</p></GlassCard>
              ) : studies.map(s => (
                <GlassCard key={s._id} className="flex items-center gap-6">
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-lg">{s.title}</h3>
                    <p className="font-body text-sm text-foreground/50 mt-1">{s.summary}</p>
                    <p className="font-display text-[9px] uppercase tracking-widest text-secondary/70 mt-2">{s.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setForm(s); setView("editor"); }} className="p-2.5 rounded-lg hover:bg-surface-high transition-colors"><Save size={15} /></button>
                    <button onClick={() => s._id && handleDelete(s._id)} className="p-2.5 rounded-lg hover:bg-error/10 text-error transition-colors"><Trash2 size={15} /></button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button onClick={() => setView("list")} className="flex items-center gap-2 font-display text-[9px] uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors">
                  <ArrowLeft size={12} /> Back
                </button>
                <h1 className="font-display text-2xl font-black tracking-tighter">{form._id ? "Edit Case Study" : "New Case Study"}</h1>
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
                {form.image && <img src={form.image} alt="cover" className="w-full h-56 object-cover rounded-lg mb-6" />}
                <p className="font-display text-[9px] uppercase tracking-widest text-secondary font-bold mb-3">{form.category}</p>
                <h2 className="font-display text-3xl font-black tracking-tighter mb-4">{form.title || "Untitled"}</h2>
                <p className="font-body text-foreground/55 mb-6 text-lg italic">{form.summary}</p>
                <div className="font-body text-foreground/70 leading-relaxed whitespace-pre-wrap mb-8">{form.content}</div>
                {form.outcome && (
                  <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-6">
                    <p className="font-display text-[9px] uppercase tracking-widest text-secondary font-bold mb-3">Outcome</p>
                    <p className="font-body text-foreground/70">{form.outcome}</p>
                  </div>
                )}
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
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block font-display text-[9px] uppercase tracking-widest text-foreground/40 font-bold mb-2">Title *</label>
                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      className="w-full bg-surface-high/60 border border-outline/15 rounded-xl px-4 py-3 font-display font-black text-lg focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/25"
                      placeholder="Case Study Title" />
                  </div>
                  <div>
                    <label className="block font-display text-[9px] uppercase tracking-widest text-foreground/40 font-bold mb-2">Category</label>
                    <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full bg-surface-high/60 border border-outline/15 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/25"
                      placeholder="Backend Architecture" />
                  </div>
                </div>
                <div>
                  <label className="block font-display text-[9px] uppercase tracking-widest text-foreground/40 font-bold mb-2">Summary / TL;DR</label>
                  <textarea value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} rows={2}
                    className="w-full bg-surface-high/60 border border-outline/15 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/25 resize-none"
                    placeholder="One-paragraph summary of the case study..." />
                </div>
                <div>
                  <label className="block font-display text-[9px] uppercase tracking-widest text-foreground/40 font-bold mb-2">Full Content *</label>
                  <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={20}
                    className="w-full bg-surface-high/60 border border-outline/15 rounded-xl px-5 py-4 font-body text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/25 resize-none leading-relaxed"
                    placeholder="Write the full case study content here..." />
                </div>
                <div>
                  <label className="block font-display text-[9px] uppercase tracking-widest text-foreground/40 font-bold mb-2">Outcome / Results</label>
                  <textarea value={form.outcome} onChange={e => setForm(f => ({ ...f, outcome: e.target.value }))} rows={3}
                    className="w-full bg-surface-high/60 border border-outline/15 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:border-secondary transition-colors placeholder:text-foreground/25 resize-none"
                    placeholder="Key measurable outcomes and results..." />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function CaseStudyEditorPage() {
  return <Suspense><CaseStudyEditorInner /></Suspense>;
}
