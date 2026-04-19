"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2, ExternalLink, Code, Layers, Save, Github } from "lucide-react";
import { 
  createProject, 
  updateProject, 
  deleteProject 
} from "@/lib/actions/projects";
import { toast } from "react-hot-toast";
import GlassCard from "@/components/GlassCard";
import CloudinaryUpload from "./CloudinaryUpload";
import Image from "next/image";
import AdminEditor from "./AdminEditor";

export default function ProjectManagement({ initialProjects }: { initialProjects: any[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    id: "",
    type: "",
    year: "",
    description: "",
    tech: "",
    link: "",
    github: "",
    image: "",
    overview: "",
    challenge: "",
    solution: "",
    outcome: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      id: "",
      type: "",
      year: "",
      description: "",
      tech: "",
      link: "",
      github: "",
      image: "",
      overview: "",
      challenge: "",
      solution: "",
      outcome: "",
    });
    setCurrentProject(null);
    setIsEditing(false);
  };

  const handleEdit = (project: any) => {
    setCurrentProject(project);
    setFormData({
      title: project.title || "",
      id: project.id || "",
      type: project.type || "",
      year: project.year || "",
      description: project.description || "",
      tech: Array.isArray(project.tech) ? project.tech.join(", ") : (project.tech || ""),
      link: project.link || "",
      github: project.github || "",
      image: project.image || "",
      overview: project.overview || "",
      challenge: project.challenge || "",
      solution: project.solution || "",
      outcome: project.outcome || "",
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.image) {
      toast.error("Project image is required");
      setIsSubmitting(false);
      return;
    }

    if (!formData.title || !formData.id || !formData.year || !formData.description) {
      toast.error("Title, ID, year, and description are required");
      setIsSubmitting(false);
      return;
    }

    const data = {
      ...formData,
      tech: formData.tech.split(",").map(t => t.trim()).filter(Boolean),
    };

    try {
      if (currentProject) {
        const updated = await updateProject(currentProject._id, data);
        setProjects(projects.map(p => p._id === currentProject._id ? updated : p));
        toast.success("Project updated successfully");
      } else {
        const created = await createProject(data);
        setProjects([created, ...projects]);
        toast.success("Project launched successfully");
      }
      resetForm();
    } catch (error) {
      toast.error("Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will permanently remove this project from your portfolio.")) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter(p => p._id !== id));
      toast.success("Project removed");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="font-display text-4xl font-black tracking-tight mb-2">Portfolio Management</h2>
          <p className="font-body text-sm text-foreground/40">Curate and showcase your best technical achievements.</p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-3 bg-primary text-surface-lowest px-8 py-4 rounded-xl font-display font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_0_30px_-5px_rgba(var(--primary-rgb),0.5)] hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={16} strokeWidth={3} /> Launch New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((proj) => (
          <GlassCard key={proj._id} hoverEffect glowColor="primary" className="group flex flex-col h-full border-outline/10 hover:border-primary/20 transition-all duration-500 p-0 overflow-hidden">
            <div className="relative h-56 w-full overflow-hidden bg-surface-high">
              <Image 
                src={proj.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c"} 
                alt={proj.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90" />
              <div className="absolute top-4 left-4">
                 <span className="px-3 py-1.5 rounded bg-background/60 backdrop-blur-md border border-outline/10 text-[9px] font-display font-black uppercase tracking-widest text-primary">
                   {proj.type}
                 </span>
              </div>
            </div>
            
            <div className="p-8 flex flex-col flex-1 relative z-10 -mt-10">
              <h3 className="font-display font-black text-2xl mb-3 group-hover:text-primary transition-colors line-clamp-1">{proj.title}</h3>
              <p className="text-xs text-foreground/50 font-body line-relaxed line-clamp-3 mb-6 flex-1">{proj.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                 {Array.isArray(proj.tech) && proj.tech.slice(0, 3).map((t: string, i: number) => (
                   <span key={i} className="text-[8px] font-display font-bold uppercase tracking-widest text-foreground/40 px-2 py-1 bg-surface-high/50 rounded-md border border-outline/5">
                     {t}
                   </span>
                 ))}
                 {Array.isArray(proj.tech) && proj.tech.length > 3 && (
                   <span className="text-[8px] font-display font-bold uppercase text-foreground/30 px-2 py-1">+{proj.tech.length - 3} more</span>
                 )}
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-outline/10">
                <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-foreground/30 hover:text-primary transition-all">
                   <ExternalLink size={18} />
                </a>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(proj)}
                    className="p-3 rounded-xl bg-surface-high/50 hover:bg-primary hover:text-surface-lowest transition-all group"
                  >
                    <Pencil size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj._id)}
                    className="p-3 rounded-xl bg-surface-high/50 hover:bg-red-500/10 text-red-500 transition-all group"
                  >
                    <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-outline/20 rounded-3xl bg-surface-high/10">
            <Layers className="mx-auto text-foreground/20 mb-4" size={48} />
            <p className="text-foreground/40 font-display font-bold">No projects launched yet.</p>
          </div>
        )}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-background/90 backdrop-blur-2xl animate-in fade-in duration-300">
          <GlassCard className="w-full max-w-6xl max-h-[90vh] overflow-y-auto relative p-0 border-outline/20 shadow-2xl custom-scrollbar flex flex-col">
            <div className="sticky top-0 z-20 bg-surface-low/90 backdrop-blur-xl px-10 py-6 border-b border-outline/10 flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-30" />
              <div className="relative z-10">
                <h2 className="font-display text-2xl font-black text-primary">{currentProject ? "Update Architecture" : "Deploy Architecture"}</h2>
                <p className="text-[10px] font-display font-bold uppercase tracking-widest text-foreground/40 mt-1">Project Specification Editor</p>
              </div>
              <button onClick={resetForm} className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-surface-high/80 transition-all relative z-10">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Core Details (Left 2 columns) */}
                <div className="lg:col-span-2 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3 relative group">
                      <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/40 pl-1 group-hover:text-primary transition-colors">Project Title</label>
                      <input
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-surface-high/40 border border-outline/10 rounded-xl px-6 py-4 font-display font-bold text-lg focus:outline-none focus:border-primary focus:bg-surface-high transition-all"
                        placeholder="e.g. Quantum Engine"
                        required
                      />
                    </div>
                    <div className="space-y-3 relative group">
                      <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/40 pl-1 group-hover:text-primary transition-colors">Project Slug (ID)</label>
                      <input
                        value={formData.id}
                        onChange={e => setFormData({ ...formData, id: e.target.value })}
                        className="w-full bg-surface-high/40 border border-outline/10 rounded-xl px-6 py-4 font-mono text-sm focus:outline-none focus:border-primary focus:bg-surface-high transition-all"
                        placeholder="quantum-engine"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3 relative group">
                      <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/40 pl-1 group-hover:text-primary transition-colors">Category</label>
                      <input
                        value={formData.type}
                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                        className="w-full bg-surface-high/40 border border-outline/10 rounded-xl px-6 py-4 font-body text-sm focus:outline-none focus:border-primary focus:bg-surface-high transition-all"
                        placeholder="e.g. Enterprise SaaS"
                        required
                      />
                    </div>
                    <div className="space-y-3 relative group">
                      <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/40 pl-1 group-hover:text-primary transition-colors">Year</label>
                      <input
                        value={formData.year}
                        onChange={e => setFormData({ ...formData, year: e.target.value })}
                        className="w-full bg-surface-high/40 border border-outline/10 rounded-xl px-6 py-4 font-mono text-sm focus:outline-none focus:border-primary focus:bg-surface-high transition-all"
                        placeholder="2024"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3 relative group">
                    <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/40 pl-1 group-hover:text-primary transition-colors">Short Description</label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-surface-high/40 border border-outline/10 rounded-xl px-6 py-4 font-body text-sm focus:outline-none focus:border-primary focus:bg-surface-high transition-all min-h-[100px] resize-none leading-relaxed"
                      placeholder="Punchy summary of what this project accomplished..."
                      required
                    />
                  </div>

                  <div className="space-y-3 relative group">
                    <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/40 pl-1 group-hover:text-primary transition-colors">Tech Stack (Comma Separated)</label>
                    <div className="relative">
                       <Layers className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20" size={16} />
                       <input
                         value={formData.tech}
                         onChange={e => setFormData({ ...formData, tech: e.target.value })}
                         className="w-full bg-surface-high/40 border border-outline/10 rounded-xl pl-14 pr-6 py-4 font-body text-sm focus:outline-none focus:border-primary focus:bg-surface-high transition-all"
                         placeholder="React, Node.js, Postgres"
                         required
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3 relative group">
                      <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/40 pl-1 group-hover:text-primary transition-colors">Live URL</label>
                      <div className="relative">
                         <ExternalLink className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20" size={16} />
                         <input
                           value={formData.link}
                           onChange={e => setFormData({ ...formData, link: e.target.value })}
                           className="w-full bg-surface-high/40 border border-outline/10 rounded-xl pl-14 pr-6 py-4 font-body text-sm focus:outline-none focus:border-primary focus:bg-surface-high transition-all"
                           placeholder="https://app.com"
                           required
                         />
                      </div>
                    </div>
                    <div className="space-y-3 relative group">
                      <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/40 pl-1 group-hover:text-primary transition-colors">GitHub Repository (Optional)</label>
                      <div className="relative">
                         <Github className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20" size={16} />
                         <input
                           value={formData.github}
                           onChange={e => setFormData({ ...formData, github: e.target.value })}
                           className="w-full bg-surface-high/40 border border-outline/10 rounded-xl pl-14 pr-6 py-4 font-body text-sm focus:outline-none focus:border-primary focus:bg-surface-high transition-all"
                           placeholder="https://github.com/Vinoth82003/..."
                         />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar (Right column) */}
                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/40 pl-1">Cover Imagery</label>
                    <div className="bg-surface-high/20 border border-outline/10 rounded-2xl p-6 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <CloudinaryUpload
                        currentImage={formData.image}
                        onUpload={url => setFormData({ ...formData, image: url })}
                      />
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="hidden lg:block space-y-4 p-8 rounded-2xl border border-dashed border-outline/20 bg-surface-lowest/50 text-center">
                     <Code size={32} className="mx-auto text-primary/30 mb-2" />
                     <p className="font-display font-bold text-xs uppercase tracking-widest text-foreground/30">System Architect</p>
                     <p className="font-body text-xs text-foreground/40">Ensure all details are accurate before deploying to production.</p>
                  </div>
                </div>
              </div>

              {/* Detailed Narrative Section */}
              <div className="pt-10 border-t border-outline/10 space-y-12">
                <div>
                  <h3 className="font-display text-2xl font-black tracking-tight mb-2">Narrative Architecture</h3>
                  <p className="text-sm font-body text-foreground/40 mb-8">Craft the full story behind this project.</p>
                  
                  <div className="space-y-10">
                    <div className="space-y-3">
                      <AdminEditor 
                        label="Project Overview"
                        value={formData.overview}
                        onChange={(val) => setFormData({ ...formData, overview: val })}
                        id="editor-overview"
                        placeholder="Detail the overarching ambition..."
                      />
                    </div>
                    <div className="space-y-3">
                      <AdminEditor 
                        label="Technical Challenges"
                        value={formData.challenge}
                        onChange={(val) => setFormData({ ...formData, challenge: val })}
                        id="editor-challenge"
                        placeholder="What were the hardest roadblocks?"
                      />
                    </div>
                    <div className="space-y-3">
                      <AdminEditor 
                        label="Architectural Solutions"
                        value={formData.solution}
                        onChange={(val) => setFormData({ ...formData, solution: val })}
                        id="editor-solution"
                        placeholder="How did you overcome them architecturally?"
                      />
                    </div>
                    <div className="space-y-3">
                      <AdminEditor 
                        label="Business Outcomes"
                        value={formData.outcome}
                        onChange={(val) => setFormData({ ...formData, outcome: val })}
                        id="editor-outcome"
                        placeholder="What was the measurable impact?"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="sticky bottom-0 left-0 right-0 p-6 bg-surface-low/90 backdrop-blur-xl border-t border-outline/10 -mx-10 -mb-10 flex gap-4 z-20">
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-1/3 bg-surface-high text-foreground py-5 rounded-xl font-display font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-surface-high/80 transition-all focus:ring-2 focus:ring-outline/50"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 bg-primary text-surface-lowest py-5 rounded-xl font-display font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_0_40px_-10px_rgba(var(--primary-rgb),0.5)] hover:bg-primary-hover hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50 focus:ring-4 focus:ring-primary/30"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={18} />}
                  {isSubmitting ? "Processing Transaction..." : currentProject ? "Commit Updates" : "Deploy Project"}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--outline);
          opacity: 0.2;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--primary-rgb), 0.5);
        }
      `}</style>
    </div>
  );
}
