"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  Trophy,
  Layout,
  Clock,
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  Code2,
  X,
  ChevronDown,
  ChevronUp,
  Pencil,
  Loader2
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import AdminEditor from "@/components/admin/AdminEditor";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface Section {
  heading: string;
  content: string;
  code?: string;
}

interface CaseStudy {
  _id?: string;
  id: string; // Slug
  title: string;
  category: string;
  readTime: string;
  description: string;
  image: string;
  heroImage?: string;
  sections: Section[];
  outcome: string[];
  relatedIds: string[];
}

function CaseStudyEditorInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("id");

  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [form, setForm] = useState<CaseStudy>({ 
    id: "",
    title: "", 
    category: "", 
    readTime: "5 min read",
    description: "", 
    image: "",
    heroImage: "",
    sections: [{ heading: "Introduction", content: "" }],
    outcome: [],
    relatedIds: []
  });
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"list" | "editor">("list");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchStudies = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/case-studies");
      const data = await res.json();
      if (Array.isArray(data.caseStudies)) setStudies(data.caseStudies);
    } catch {
      toast.error("Failed to fetch case studies");
    }
  }, []);

  useEffect(() => {
    fetchStudies();
  }, [fetchStudies]);

  useEffect(() => {
    if (editId) {
      const cs = studies.find(s => s._id === editId || s.id === editId);
      if (cs) {
        setForm({
          ...cs,
          sections: cs.sections || [{ heading: "Introduction", content: "" }],
          outcome: cs.outcome || [],
          relatedIds: cs.relatedIds || []
        });
        setView("editor");
      }
    } else if (searchParams.get("new")) {
      setForm({ 
        id: "",
        title: "", 
        category: "", 
        readTime: "5 min read",
        description: "", 
        image: "",
        heroImage: "",
        sections: [{ heading: "Introduction", content: "" }],
        outcome: [],
        relatedIds: []
      });
      setView("editor");
    }
  }, [editId, studies, searchParams]);

  const handleSave = async () => {
    if (!form.title || !form.id) {
      toast.error("Title and Slug are required.");
      return;
    }
    
    setSaving(true);
    try {
      const isEdit = !!form._id;
      const url = isEdit ? `/api/admin/case-studies?id=${form._id}` : "/api/admin/case-studies";
      const method = isEdit ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      
      if (!res.ok) throw new Error();
      const data = await res.json();
      
      if (isEdit) {
        setStudies(ss => ss.map(s => s._id === form._id ? data.caseStudy : s));
      } else {
        setStudies(ss => [data.caseStudy, ...ss]);
        setForm(data.caseStudy);
        router.push(`/admin/case-study-editor?id=${data.caseStudy._id}`, { scroll: false });
      }
      
      toast.success(isEdit ? "Case study updated!" : "Case study published!");
      setView("list");
    } catch {
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this case study? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/case-studies?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setStudies(ss => ss.filter(s => s._id !== id));
        toast.success("Case study deleted");
        if (form._id === id) setView("list");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const updateSection = (index: number, field: keyof Section, value: string) => {
    const newSections = [...form.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setForm({ ...form, sections: newSections });
  };

  const addSection = () => {
    setForm({ ...form, sections: [...form.sections, { heading: "New Section", content: "" }] });
  };

  const removeSection = (index: number) => {
    if (form.sections.length <= 1) return;
    setForm({ ...form, sections: form.sections.filter((_, i) => i !== index) });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...form.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    setForm({ ...form, sections: newSections });
  };

  const filteredStudies = studies.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-72 bg-surface-low/30 backdrop-blur-xl border-r border-outline/10 flex flex-col z-40 p-8">
        <Link href="/admin/dashboard" className="group flex items-center gap-3 font-display text-[10px] uppercase tracking-[0.2em] text-foreground/30 hover:text-primary transition-all mb-12">
          <div className="w-6 h-6 rounded-full bg-surface-high flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <ArrowLeft size={12} />
          </div>
          Dashboard
        </Link>
        
        <div className="mb-10">
          <h2 className="font-display font-black text-2xl tracking-tighter text-foreground text-secondary">Work Case</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <p className="font-display text-[10px] uppercase tracking-widest text-foreground/30">{studies.length} Deep Dives</p>
          </div>
        </div>

        <button 
          onClick={() => {
            setForm({ 
              id: "",
              title: "", 
              category: "", 
              readTime: "5 min read",
              description: "", 
              image: "",
              heroImage: "",
              sections: [{ heading: "Introduction", content: "" }],
              outcome: [],
              relatedIds: []
            });
            setView("editor");
            router.push("/admin/case-study-editor?new=true", { scroll: false });
          }}
          className="flex items-center justify-center gap-3 bg-secondary text-surface-lowest px-6 py-4 rounded-xl font-display font-bold text-[10px] uppercase tracking-widest mb-10 hover:shadow-[0_0_30px_-5px_rgba(var(--secondary-rgb),0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={14} strokeWidth={3} /> New Case Study
        </button>

        <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
          {studies.map(s => (
            <button 
              key={s._id} 
              onClick={() => {
                setForm({
                  ...s,
                  sections: s.sections || [{ heading: "Introduction", content: "" }],
                  outcome: s.outcome || [],
                  relatedIds: s.relatedIds || []
                });
                setView("editor");
                router.push(`/admin/case-study-editor?id=${s._id}`, { scroll: false });
              }}
              className={`w-full group text-left px-4 py-4 rounded-xl transition-all duration-300 ${form._id === s._id && view === "editor" ? "bg-surface-high border-l-4 border-secondary pl-5" : "hover:bg-surface-high/50 border-l-4 border-transparent"}`}
            >
              <p className={`font-display font-bold text-xs truncate transition-colors ${form._id === s._id && view === "editor" ? "text-secondary" : "text-foreground/70"}`}>
                {s.title || "Untitled Project"}
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <p className="font-display text-[8px] text-foreground/30 uppercase tracking-widest">{s.category}</p>
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
                <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tighter mb-4 text-secondary">Success Stories</h1>
                <p className="font-body text-foreground/40 max-w-lg">Showcase your problem-solving skills and the impact of your work through detailed case studies.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={16} />
                  <input 
                    type="text"
                    placeholder="Search studies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 pr-6 py-3 bg-surface-low/50 border border-outline/10 rounded-xl font-body text-sm focus:outline-none focus:border-secondary/50 transition-all w-64"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredStudies.length === 0 ? (
                <GlassCard className="flex flex-col items-center justify-center py-20 text-center">
                  <Briefcase className="text-foreground/10 mb-6" size={48} />
                  <h3 className="font-display font-bold text-xl mb-2">No studies yet</h3>
                  <button onClick={() => setView("editor")} className="text-secondary font-display text-[10px] uppercase font-black border-b border-secondary/20 hover:border-secondary transition-all">Create your first deep dive</button>
                </GlassCard>
              ) : filteredStudies.map(s => (
                <GlassCard key={s._id} className="group flex flex-col md:flex-row items-center gap-8 p-6 hover:border-secondary/20 transition-all duration-500">
                  <div className="w-full md:w-56 h-36 rounded-xl overflow-hidden bg-surface-high flex-shrink-0 relative">
                    <img src={s.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-[9px] text-secondary font-black uppercase tracking-widest mb-2">{s.category}</p>
                    <h3 className="font-display font-black text-2xl tracking-tight group-hover:text-secondary transition-colors truncate">{s.title}</h3>
                    <p className="font-body text-sm text-foreground/40 mt-2 line-clamp-2">{s.description}</p>
                    
                    <div className="flex items-center gap-4 mt-6">
                       <div className="flex items-center gap-1.5 text-foreground/30 bg-surface-high/40 px-3 py-1 rounded-full border border-outline/5">
                         <Clock size={12} className="text-primary/50" />
                         <span className="font-display text-[9px] uppercase tracking-widest font-bold">{s.readTime}</span>
                       </div>
                       <div className="flex items-center gap-1.5 text-foreground/30 bg-surface-high/40 px-3 py-1 rounded-full border border-outline/5">
                         <Layout size={12} className="text-secondary/50" />
                         <span className="font-display text-[9px] uppercase tracking-widest font-bold">{s.sections?.length || 0} Sections</span>
                       </div>
                    </div>
                  </div>
                  
                  <div className="flex md:flex-col gap-2 w-full md:w-auto">
                    <button 
                      onClick={() => {
                        setForm({
                          ...s,
                          sections: s.sections || [{ heading: "Introduction", content: "" }],
                          outcome: s.outcome || [],
                          relatedIds: s.relatedIds || []
                        });
                        setView("editor");
                        router.push(`/admin/case-study-editor?id=${s._id}`, { scroll: false });
                      }} 
                      className="flex-1 md:flex-none p-4 rounded-xl bg-surface-high/50 hover:bg-secondary hover:text-surface-lowest transition-all"
                    >
                      <Pencil size={18} className="mx-auto" />
                    </button>
                    <button 
                      onClick={() => s._id && handleDelete(s._id)} 
                      className="flex-1 md:flex-none p-4 rounded-xl bg-surface-high/50 hover:bg-error/10 hover:text-error transition-all"
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
                <button onClick={() => { setView("list"); router.push("/admin/case-study-editor", { scroll: false }); }} className="w-10 h-10 rounded-full border border-outline/10 flex items-center justify-center hover:bg-surface-high transition-all">
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h1 className="font-display text-3xl font-black tracking-tighter text-secondary">Documenting Impact</h1>
                  <p className="font-body text-xs text-foreground/30 mt-1 uppercase tracking-[0.1em]">Section-Based Case Study Architect</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleSave()} 
                  disabled={saving} 
                  className="flex items-center gap-2 bg-secondary text-surface-lowest px-10 py-4 rounded-xl font-display font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_0_30px_-5px_rgba(var(--secondary-rgb),0.5)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : "Publish Deep Dive"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-12">
                <GlassCard className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/30 pl-1">Project Title</label>
                      <input 
                        value={form.title} 
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        className="w-full bg-transparent border-b border-outline/20 px-0 py-4 font-display font-black text-2xl lg:text-3xl focus:outline-none focus:border-secondary transition-all"
                        placeholder="Scaling to 10x Traffic..." 
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/30 pl-1">URL Slug (ID)</label>
                      <input 
                        value={form.id} 
                        onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                        className="w-full bg-transparent border-b border-outline/20 px-0 py-4 font-display font-bold text-lg focus:outline-none focus:border-secondary transition-all font-mono"
                        placeholder="redis-scaling-srimaccafes" 
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-3">
                      <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/30 pl-1">Category</label>
                      <input 
                        value={form.category} 
                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full bg-surface-high/30 border border-outline/10 rounded-xl px-5 py-4 font-display font-bold text-sm focus:outline-none focus:border-secondary transition-all"
                        placeholder="Backend Architecture" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/30 pl-1">Read Time</label>
                      <input 
                        value={form.readTime} 
                        onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))}
                        className="w-full bg-surface-high/30 border border-outline/10 rounded-xl px-5 py-4 font-display font-bold text-sm focus:outline-none focus:border-secondary transition-all"
                        placeholder="8 min read" 
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/30 pl-1">Executive Description</label>
                    <textarea 
                       value={form.description} 
                       onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                       className="w-full bg-surface-high/30 border border-outline/10 rounded-xl px-5 py-4 font-body text-sm focus:outline-none focus:border-secondary transition-all min-h-[100px]"
                       placeholder="How I used Redis caching to reduce MongoDB read load..." 
                    />
                  </div>
                </GlassCard>

                {/* Sections Editor */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="font-display font-black text-xl tracking-tight uppercase text-foreground/40">Narrative Sections</h3>
                    <button 
                      onClick={addSection}
                      className="flex items-center gap-2 text-secondary font-display text-[10px] uppercase font-black hover:bg-secondary/10 px-4 py-2 rounded-lg transition-all"
                    >
                       <Plus size={14} /> Add Content Section
                    </button>
                  </div>

                  {form.sections.map((section, index) => (
                    <GlassCard key={index} className="p-8 space-y-6 relative group/section">
                      <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover/section:opacity-100 transition-opacity">
                         <button onClick={() => moveSection(index, 'up')} className="p-2 hover:bg-surface-high rounded-lg text-foreground/30 hover:text-primary"><ChevronUp size={16}/></button>
                         <button onClick={() => moveSection(index, 'down')} className="p-2 hover:bg-surface-high rounded-lg text-foreground/30 hover:text-primary"><ChevronDown size={16}/></button>
                         <button onClick={() => removeSection(index)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-500/50 hover:text-red-500"><Trash2 size={16}/></button>
                      </div>

                      <div className="space-y-4">
                        <input 
                          value={section.heading}
                          onChange={(e) => updateSection(index, 'heading', e.target.value)}
                          className="font-display font-black text-xl bg-transparent border-none p-0 focus:ring-0 text-secondary w-full"
                          placeholder="Section Heading (e.g., The Problem)"
                        />
                        <AdminEditor 
                          value={section.content}
                          onChange={(val) => updateSection(index, 'content', val)}
                          id={`section-${index}`}
                          placeholder="Section narrative content..."
                        />
                      </div>

                      <div className="pt-4 border-t border-outline/5">
                        <label className="flex items-center gap-2 text-[9px] font-display font-bold uppercase tracking-widest text-foreground/20 mb-3">
                           <Code2 size={12} /> Embedded Code Block (Optional)
                        </label>
                        <textarea 
                           value={section.code || ""}
                           onChange={(e) => updateSection(index, 'code', e.target.value)}
                           className="w-full bg-surface-lowest/50 border border-outline/5 rounded-lg p-4 font-mono text-xs text-primary min-h-[100px] focus:outline-none focus:border-primary/30"
                           placeholder="// Your technical implementation here..."
                        />
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>

              {/* Sidebar Settings Area */}
              <div className="space-y-8">
                <GlassCard className="p-8 space-y-8 border-outline/15 shadow-xl">
                  {/* Images */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/30 mb-4">Thumbnail Image</label>
                      <input 
                        value={form.image} 
                        onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                        className="w-full bg-surface-high/30 border border-outline/10 rounded-xl px-4 py-3 font-body text-[10px] mb-4 focus:outline-none focus:border-secondary transition-all"
                        placeholder="Thumbnail URL" 
                      />
                      <div className="aspect-video w-full rounded-2xl bg-surface-high overflow-hidden border border-outline/10 group relative">
                         {form.image ? <img src={form.image} alt="" className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-foreground/10"><ImageIcon size={32}/></div>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/30 mb-4">Hero/Banner Image</label>
                      <input 
                        value={form.heroImage} 
                        onChange={e => setForm(f => ({ ...f, heroImage: e.target.value }))}
                        className="w-full bg-surface-high/30 border border-outline/10 rounded-xl px-4 py-3 font-body text-[10px] mb-4 focus:outline-none focus:border-secondary transition-all"
                        placeholder="Hero Image URL" 
                      />
                      <div className="aspect-[21/9] w-full rounded-2xl bg-surface-high overflow-hidden border border-outline/10 group relative">
                         {form.heroImage ? <img src={form.heroImage} alt="" className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-foreground/10"><ImageIcon size={32}/></div>}
                      </div>
                    </div>
                  </div>

                  {/* Outcomes - Array Editor */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/30 flex items-center gap-2">
                         <Trophy size={11} className="text-yellow-500" /> Key Outcomes
                      </label>
                      <button 
                        type="button"
                        onClick={() => setForm({ ...form, outcome: [...form.outcome, ""] })}
                        className="text-[10px] text-secondary font-black"
                      >
                         Add Point
                      </button>
                    </div>
                    <div className="space-y-3">
                      {form.outcome.map((point, idx) => (
                        <div key={idx} className="flex gap-3">
                          <input 
                            value={point}
                            onChange={(e) => {
                              const newOutcomes = [...form.outcome];
                              newOutcomes[idx] = e.target.value;
                              setForm({ ...form, outcome: newOutcomes });
                            }}
                            className="flex-1 bg-surface-high/30 border border-outline/10 rounded-xl px-4 py-3 font-body text-[10px] focus:outline-none focus:border-secondary transition-all"
                            placeholder="e.g., 80% reduction in latency"
                          />
                          <button 
                            type="button"
                            onClick={() => setForm({ ...form, outcome: form.outcome.filter((_, i) => i !== idx) })}
                            className="text-foreground/20 hover:text-red-500 p-2"
                          >
                             <X size={14} />
                          </button>
                        </div>
                      ))}
                      {form.outcome.length === 0 && <p className="text-[10px] text-foreground/20 italic text-center py-4 border border-dashed border-outline/10 rounded-xl">No outcomes added.</p>}
                    </div>
                  </div>

                  {/* Related IDs */}
                  <div>
                    <label className="block text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/30 mb-3 pl-1">Related Project Slugs</label>
                    <input 
                      value={form.relatedIds.join(", ")} 
                      onChange={e => setForm(f => ({ ...f, relatedIds: e.target.value.split(",").map(id => id.trim()).filter(Boolean) }))} 
                      className="w-full bg-surface-high/30 border border-outline/10 rounded-xl px-5 py-4 font-mono text-[10px] focus:outline-none focus:border-secondary transition-all placeholder:text-foreground/10"
                      placeholder="srimaccafes, razorpay-webhook" 
                    />
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CaseStudyEditorPage() {
  return <Suspense><CaseStudyEditorInner /></Suspense>;
}
