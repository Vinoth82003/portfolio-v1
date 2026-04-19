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
  Loader2,
  BookOpen
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
    } else {
      setView("list");
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
      router.push("/admin/case-study-editor", { scroll: false });
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
        if (form._id === id) {
          setView("list");
          router.push("/admin/case-study-editor", { scroll: false });
        }
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
    <div className="min-h-screen bg-background flex">
      {/* Dynamic Left Sidebar Overlay/Drawer on Mobile, Sidebar on Desktop */}
      <aside className={`fixed left-0 top-0 bottom-0 h-screen w-80 bg-surface-low/50 backdrop-blur-3xl border-r border-outline/10 flex flex-col z-[40] transition-transform duration-500 ease-in-out ${view === 'editor' ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}>
        <div className="p-8 pb-4">
          <Link href="/admin/dashboard" className="group flex items-center gap-3 font-display text-[10px] uppercase tracking-[0.2em] text-foreground/40 hover:text-secondary transition-all mb-10">
            <div className="w-8 h-8 rounded-full bg-surface-high border border-outline/10 flex items-center justify-center group-hover:bg-secondary/10 group-hover:border-secondary/30 transition-all">
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            </div>
            Back to Hub
          </Link>
          
          <div className="mb-8">
            <h2 className="font-display font-black text-3xl tracking-tighter text-foreground text-secondary drop-shadow-[0_0_15px_rgba(var(--secondary-rgb),0.3)]">Deep Dives</h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <p className="font-display text-[10px] uppercase tracking-widest text-foreground/40">{studies.length} Published</p>
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
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-br from-secondary to-secondary-dim text-surface-lowest px-6 py-4 rounded-xl font-display font-black text-[10px] uppercase tracking-widest mb-6 shadow-[0_0_20px_-5px_rgba(var(--secondary-rgb),0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus size={16} strokeWidth={3} /> Draft New Case Study
          </button>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto px-4 pb-8 custom-scrollbar">
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
              className={`w-full group text-left px-5 py-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${form._id === s._id && view === "editor" ? "bg-surface-high/60 border-outline/20 shadow-lg" : "hover:bg-surface-high/30 border-transparent hover:border-outline/10"} border`}
            >
              {form._id === s._id && view === "editor" && <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-l-2xl" />}
              <p className={`font-display font-black text-sm truncate transition-colors ${form._id === s._id && view === "editor" ? "text-secondary" : "text-foreground/80 group-hover:text-foreground"}`}>
                {s.title || "Untitled Project"}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-display text-[8px] px-2 py-0.5 rounded bg-surface-highest/50 text-foreground/40 uppercase tracking-widest font-bold border border-outline/5 truncate">{s.category || "Uncategorized"}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-500 relative`}>
        {view === "list" ? (
          <div className="p-8 lg:p-16 max-w-6xl mx-auto min-h-full flex flex-col pt-24 lg:pt-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 relative z-10">
              <div>
                <h1 className="font-display text-5xl lg:text-7xl font-black tracking-tighter mb-4 text-secondary drop-shadow-md">Architectural Analytics</h1>
                <p className="font-body text-foreground/50 max-w-xl text-lg leading-relaxed">Curate technical deep dives that detail the architecture, challenges, and solutions behind your work.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-secondary transition-colors" size={18} />
                  <input 
                    type="text"
                    placeholder="Search studies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-6 py-4 bg-surface-low/80 backdrop-blur-md border border-outline/10 hover:border-outline/30 rounded-2xl font-body text-sm focus:outline-none focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10 transition-all w-full md:w-72"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 relative z-10 pb-20">
              {filteredStudies.length === 0 ? (
                <GlassCard hoverEffect={false} className="flex flex-col items-center justify-center py-32 text-center border-dashed border-outline/20">
                  <BookOpen className="text-foreground/10 mb-6" size={64} strokeWidth={1} />
                  <h3 className="font-display font-black text-2xl mb-3 text-foreground/60">No Publications Yet</h3>
                  <p className="text-foreground/40 font-body mb-8 max-w-sm mx-auto">Start documenting your architectural knowledge and share your engineering journey.</p>
                  <button onClick={() => { setView("editor"); router.push("/admin/case-study-editor?new=true", {scroll: false}); }} className="px-8 py-4 rounded-xl bg-secondary/10 text-secondary font-display text-[10px] uppercase font-black hover:bg-secondary/20 transition-all border border-secondary/20 hover:border-secondary/40">Draft First Case Study</button>
                </GlassCard>
              ) : filteredStudies.map((s, i) => (
                <GlassCard key={s._id} hoverEffect glowColor="secondary" className="group flex flex-col lg:flex-row items-center gap-10 p-6 lg:p-8 hover:border-secondary/30 transition-all duration-500 overflow-hidden relative">
                  <div className="w-full lg:w-72 h-48 lg:h-40 rounded-2xl overflow-hidden bg-surface-high flex-shrink-0 relative border border-outline/10">
                    <img src={s.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f"} alt="" className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-in-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-center py-2">
                    <p className="font-display text-[10px] text-secondary font-black uppercase tracking-widest mb-3 bg-secondary/10 inline-block px-3 py-1 rounded w-fit">{s.category}</p>
                    <h3 className="font-display font-black text-3xl tracking-tight group-hover:text-secondary transition-colors truncate mb-3">{s.title}</h3>
                    <p className="font-body text-foreground/50 leading-relaxed line-clamp-2 pr-4">{s.description}</p>
                    
                    <div className="flex items-center gap-6 mt-6 pt-6 border-t border-outline/10">
                       <div className="flex items-center gap-2 text-foreground/40 font-display text-[10px] uppercase tracking-widest font-bold">
                         <Clock size={14} className="text-secondary opacity-70" />
                         {s.readTime}
                       </div>
                       <div className="flex items-center gap-2 text-foreground/40 font-display text-[10px] uppercase tracking-widest font-bold">
                         <Layout size={14} className="text-primary opacity-70" />
                         {s.sections?.length || 0} Portions
                       </div>
                    </div>
                  </div>
                  
                  <div className="flex lg:flex-col gap-3 w-full lg:w-auto mt-6 lg:mt-0 lg:pl-6 lg:border-l lg:border-outline/10">
                    <button 
                      onClick={() => {
                        setForm({ ...s, sections: s.sections || [{ heading: "Introduction", content: "" }], outcome: s.outcome || [], relatedIds: s.relatedIds || [] });
                        setView("editor");
                        router.push(`/admin/case-study-editor?id=${s._id}`, { scroll: false });
                      }} 
                      className="flex-1 lg:flex-none p-5 rounded-2xl bg-surface-high/40 hover:bg-secondary hover:text-surface-lowest hover:shadow-lg hover:shadow-secondary/20 transition-all border border-outline/5 hover:border-transparent group/btn"
                    >
                      <Pencil size={20} className="mx-auto group-hover/btn:scale-110 transition-transform" />
                    </button>
                    <button 
                      onClick={() => s._id && handleDelete(s._id)} 
                      className="flex-1 lg:flex-none p-5 rounded-2xl bg-surface-high/40 hover:bg-error hover:text-surface-lowest hover:shadow-lg hover:shadow-error/20 transition-all border border-outline/5 hover:border-transparent group/btn"
                    >
                      <Trash2 size={20} className="mx-auto group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative min-h-screen">
            {/* Editor Top Bar - Sticky */}
            <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-2xl border-b border-outline/10 px-6 lg:px-12 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => { setView("list"); router.push("/admin/case-study-editor", { scroll: false }); }} className="lg:hidden w-10 h-10 rounded-full bg-surface-high flex items-center justify-center text-foreground/60 hover:text-foreground">
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <p className="font-display text-[9px] uppercase tracking-widest text-secondary font-bold mb-1">Editor Mode</p>
                  <h1 className="font-display text-xl font-black truncate max-w-xs md:max-w-md">{form.title || "Untitled Document"}</h1>
                </div>
              </div>
              
              <button 
                onClick={() => handleSave()} 
                disabled={saving} 
                className="flex items-center gap-2 bg-secondary text-surface-lowest px-6 py-3 rounded-xl font-display font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_-5px_rgba(var(--secondary-rgb),0.4)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={14}/> {form._id ? "Commit" : "Publish"}</>}
              </button>
            </div>

            <div className="p-6 lg:p-12 max-w-[1400px] mx-auto pb-32">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Main Editor Pane */}
                <div className="xl:col-span-8 space-y-10">
                  {/* Meta GlassCard */}
                  <GlassCard hoverEffect={false} className="p-8 lg:p-10 space-y-8 border-t-4 border-t-secondary">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3 relative group">
                        <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/40 pl-1 group-hover:text-secondary transition-colors">Study Title</label>
                        <input 
                          value={form.title} 
                          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                          className="w-full bg-surface-high/30 focus:bg-surface-high border border-outline/10 focus:border-secondary rounded-xl px-6 py-4 font-display font-black text-2xl placeholder:text-foreground/20 outline-none transition-all"
                          placeholder="e.g. Scaling User Auth to 10k RPS" 
                          required
                        />
                      </div>
                      <div className="space-y-3 relative group">
                        <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/40 pl-1 group-hover:text-secondary transition-colors">URL Slug</label>
                        <input 
                          value={form.id} 
                          onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                          className="w-full bg-surface-high/30 focus:bg-surface-high border border-outline/10 focus:border-secondary rounded-xl px-6 py-4 font-mono text-sm placeholder:text-foreground/20 outline-none transition-all"
                          placeholder="scaling-auth-10k-rps" 
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3 relative group">
                        <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/40 pl-1 group-hover:text-secondary transition-colors">Technical Category</label>
                        <input 
                          value={form.category} 
                          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                          className="w-full bg-surface-high/30 focus:bg-surface-high border border-outline/10 focus:border-secondary rounded-xl px-6 py-4 font-body text-sm outline-none transition-all"
                          placeholder="Backend Optimization" 
                        />
                      </div>
                      <div className="space-y-3 relative group">
                        <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/40 pl-1 group-hover:text-secondary transition-colors">Est. Read Time</label>
                        <input 
                          value={form.readTime} 
                          onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))}
                          className="w-full bg-surface-high/30 focus:bg-surface-high border border-outline/10 focus:border-secondary rounded-xl px-6 py-4 font-mono text-sm outline-none transition-all"
                          placeholder="12 min read" 
                        />
                      </div>
                    </div>

                    <div className="space-y-3 relative group">
                      <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/40 pl-1 group-hover:text-secondary transition-colors">Executive Abstract</label>
                      <textarea 
                         value={form.description} 
                         onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                         className="w-full bg-surface-high/30 focus:bg-surface-high border border-outline/10 focus:border-secondary rounded-xl px-6 py-4 font-body text-sm min-h-[120px] resize-none outline-none transition-all leading-relaxed"
                         placeholder="A brief compelling summary of the problem, approach, and outcome..." 
                      />
                    </div>
                  </GlassCard>

                  {/* Sections Sequence Editor */}
                  <div>
                    <div className="flex items-center justify-between mb-8 px-2">
                      <div>
                        <h3 className="font-display font-black text-2xl tracking-tighter text-foreground mb-1">Content Sequence</h3>
                        <p className="font-body text-foreground/40 text-sm">Build your narrative section by section.</p>
                      </div>
                      <button 
                        onClick={addSection}
                        className="flex items-center gap-2 bg-surface-high border border-outline/10 text-secondary font-display text-[10px] uppercase font-black hover:bg-secondary hover:text-surface-lowest px-5 py-3 rounded-xl transition-all shadow-sm"
                      >
                         <Plus size={14} /> Add Block
                      </button>
                    </div>

                    <div className="space-y-8">
                      {form.sections.map((section, index) => (
                        <div key={index} className="relative group/section pl-10 md:pl-14">
                          {/* Timeline connector visual */}
                          <div className="absolute left-3 md:left-5 top-0 bottom-[-2rem] w-px bg-outline/20 group-last/section:bottom-0" />
                          <div className="absolute left-[-2px] md:left-[0.6rem] top-8 w-6 md:w-8 h-px bg-outline/20" />
                          <div className="absolute left-0 md:left-2 top-[1.4rem] w-6 h-6 rounded-full bg-surface-lowest border-2 border-secondary/50 flex items-center justify-center font-display font-black text-[10px] text-secondary z-10 shadow-[0_0_10px_rgba(var(--secondary-rgb),0.3)]">
                            {index + 1}
                          </div>

                          <GlassCard hoverEffect={false} className="p-6 md:p-8 space-y-6 relative border-outline/10 focus-within:border-secondary/40 transition-colors shadow-none">
                            <div className="absolute top-4 right-4 flex items-center gap-1 opacity-20 group-hover/section:opacity-100 transition-opacity bg-surface-low rounded-lg p-1 border border-outline/5">
                               <button onClick={() => moveSection(index, 'up')} disabled={index===0} className="p-1.5 hover:bg-surface-high rounded-md text-foreground/40 hover:text-foreground disabled:opacity-30"><ChevronUp size={14}/></button>
                               <button onClick={() => moveSection(index, 'down')} disabled={index===form.sections.length-1} className="p-1.5 hover:bg-surface-high rounded-md text-foreground/40 hover:text-foreground disabled:opacity-30"><ChevronDown size={14}/></button>
                               <div className="w-px h-4 bg-outline/20 mx-1" />
                               <button onClick={() => removeSection(index)} className="p-1.5 hover:bg-red-500/10 rounded-md text-foreground/40 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                            </div>

                            <div className="space-y-6 pr-16 md:pr-0">
                              <input 
                                value={section.heading}
                                onChange={(e) => updateSection(index, 'heading', e.target.value)}
                                className="w-full font-display font-black text-2xl bg-transparent border-none p-0 focus:ring-0 text-foreground placeholder:text-foreground/20 outline-none group-focus-within/section:text-secondary transition-colors"
                                placeholder="Section Heading"
                              />
                              <AdminEditor 
                                value={section.content}
                                onChange={(val) => updateSection(index, 'content', val)}
                                id={`section-${index}`}
                                placeholder="Write your narrative here..."
                              />
                            </div>

                            <div className="pt-6 border-t border-outline/5">
                              <div className="flex items-center justify-between mb-3">
                                <label className="flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/30">
                                   <Code2 size={14} className="text-primary/50" /> Code Snippet
                                </label>
                                {!section.code && (
                                  <button onClick={() => updateSection(index, 'code', ' ')} className="text-[9px] font-display font-bold uppercase bg-surface-high px-2 py-1 rounded text-foreground/40 hover:text-primary">Add Code Block</button>
                                )}
                              </div>
                              
                              {section.code !== undefined && (
                                <div className="relative group/code">
                                  <textarea 
                                     value={section.code}
                                     onChange={(e) => updateSection(index, 'code', e.target.value)}
                                     className="w-full bg-[#0d1117] border border-outline/10 rounded-xl p-5 font-mono text-xs md:text-sm text-[#c9d1d9] min-h-[150px] outline-none focus:border-primary/50 transition-all focus:ring-1 focus:ring-primary/20 custom-scrollbar"
                                     placeholder="// function example() { ... }"
                                  />
                                  <button onClick={() => updateSection(index, 'code', undefined as any)} className="absolute top-3 right-3 p-2 bg-surface-low/80 hover:bg-error/20 text-error rounded-lg opacity-0 group-hover/code:opacity-100 transition-opacity">
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </GlassCard>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar Configuration Pane */}
                <div className="xl:col-span-4 space-y-8">
                  {/* Media Config */}
                  <GlassCard hoverEffect={false} className="p-8 border-outline/10 shadow-lg">
                    <h4 className="font-display font-black text-lg mb-6 flex items-center gap-2 text-foreground/80"><ImageIcon size={16} className="text-secondary" /> Visual Identity</h4>
                    
                    <div className="space-y-8">
                      <div>
                        <label className="flex items-center justify-between text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/40 mb-3">
                          <span>Thumbnail <span className="text-error ml-1">*</span></span>
                        </label>
                        <input 
                          value={form.image} 
                          onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                          className="w-full bg-surface-high/30 focus:bg-surface-high border border-outline/10 focus:border-secondary rounded-lg px-4 py-3 font-body text-xs mb-3 outline-none"
                          placeholder="https://.../thumb.jpg" 
                        />
                        <div className="aspect-[4/3] w-full rounded-xl bg-surface-highest/30 overflow-hidden border border-outline/5 relative">
                           {form.image ? <img src={form.image} alt="" className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground/10"><ImageIcon size={24} className="mb-2"/><span className="text-[10px] font-display uppercase tracking-widest font-bold">No Image</span></div>}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-outline/5">
                        <label className="flex items-center justify-between text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/40 mb-3">
                          <span>Hero Banner</span>
                          <span className="text-foreground/20 text-[8px]">Optional</span>
                        </label>
                        <input 
                          value={form.heroImage || ""} 
                          onChange={e => setForm(f => ({ ...f, heroImage: e.target.value }))}
                          className="w-full bg-surface-high/30 focus:bg-surface-high border border-outline/10 focus:border-secondary rounded-lg px-4 py-3 font-body text-xs mb-3 outline-none"
                          placeholder="https://.../banner.jpg" 
                        />
                        <div className="aspect-[21/9] w-full rounded-xl bg-surface-highest/30 overflow-hidden border border-outline/5 relative">
                           {form.heroImage ? <img src={form.heroImage} alt="" className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground/10"><ImageIcon size={24} className="mb-2"/><span className="text-[10px] font-display uppercase tracking-widest font-bold">No Banner</span></div>}
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Outcomes Config */}
                  <GlassCard hoverEffect={false} className="p-8 border-outline/10 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-display font-black text-lg flex items-center gap-2 text-foreground/80">
                         <Trophy size={16} className="text-yellow-500" /> Key Outcomes
                      </h4>
                      <button 
                        type="button"
                        onClick={() => setForm({ ...form, outcome: [...form.outcome, ""] })}
                        className="w-6 h-6 rounded-md bg-secondary/10 flex items-center justify-center text-secondary hover:bg-secondary hover:text-surface-lowest transition-colors"
                      >
                         <Plus size={14} />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {form.outcome.map((point, idx) => (
                        <div key={idx} className="flex gap-2 group/outcome">
                          <div className="w-6 h-8 flex items-center justify-center font-display font-black text-xs text-secondary/40">{idx+1}.</div>
                          <input 
                            value={point}
                            onChange={(e) => {
                              const newOutcomes = [...form.outcome];
                              newOutcomes[idx] = e.target.value;
                              setForm({ ...form, outcome: newOutcomes });
                            }}
                            className="flex-1 bg-surface-high/30 border border-outline/10 focus:border-secondary rounded-lg px-4 py-2 font-body text-xs outline-none transition-all"
                            placeholder="e.g., Decreased load times by 45%"
                          />
                          <button 
                            type="button"
                            onClick={() => setForm({ ...form, outcome: form.outcome.filter((_, i) => i !== idx) })}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground/20 hover:bg-error/10 hover:text-error opacity-0 group-hover/outcome:opacity-100 transition-all"
                          >
                             <X size={14} />
                          </button>
                        </div>
                      ))}
                      {form.outcome.length === 0 && (
                        <div className="text-center py-6 border border-dashed border-outline/10 rounded-xl bg-surface-high/10">
                          <p className="text-[10px] font-display uppercase tracking-widest text-foreground/30 font-bold mb-1">No Outcomes Asserted</p>
                          <p className="text-xs text-foreground/20 font-body">Highlight the impact of this study</p>
                        </div>
                      )}
                    </div>
                  </GlassCard>

                  {/* Metadata Config */}
                  <GlassCard hoverEffect={false} className="p-8 border-outline/10 shadow-lg">
                    <h4 className="font-display font-black text-lg mb-6 flex items-center gap-2 text-foreground/80">Relationships</h4>
                    
                    <label className="block text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/40 mb-3 pl-1">Link Related Studies</label>
                    <textarea 
                      value={form.relatedIds.join(", ")} 
                      onChange={e => setForm(f => ({ ...f, relatedIds: e.target.value.split(",").map(id => id.trim()).filter(Boolean) }))} 
                      className="w-full bg-surface-high/30 focus:bg-surface-high border border-outline/10 focus:border-secondary rounded-xl px-5 py-4 font-mono text-xs outline-none transition-all placeholder:text-foreground/20 min-h-[100px] resize-none"
                      placeholder="slug-one, slug-two" 
                    />
                    <p className="text-[9px] font-body text-foreground/30 mt-2 px-1">Comma-separated case study Slugs to promote internal linking.</p>
                  </GlassCard>
                </div>
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
          background: rgba(var(--secondary-rgb), 0.5);
        }
      `}</style>
    </div>
  );
}

export default function CaseStudyEditorPage() {
  return <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-background"><Loader2 size={32} className="animate-spin text-secondary" /></div>}><CaseStudyEditorInner /></Suspense>;
}
