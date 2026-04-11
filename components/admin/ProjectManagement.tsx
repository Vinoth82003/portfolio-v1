"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Loader2, ExternalLink, Code, Layers, Save } from "lucide-react";
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
    type: "",
    desc: "",
    tech: "",
    link: "",
    image: "",
    content: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      type: "",
      desc: "",
      tech: "",
      link: "",
      image: "",
      content: "",
    });
    setCurrentProject(null);
    setIsEditing(false);
  };

  const handleEdit = (project: any) => {
    setCurrentProject(project);
    setFormData({
      title: project.title,
      type: project.type,
      desc: project.desc,
      tech: Array.isArray(project.tech) ? project.tech.join(", ") : project.tech,
      link: project.link,
      image: project.image,
      content: project.content,
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

    const formattedData = {
      ...formData,
      tech: formData.tech.split(",").map(t => t.trim()).filter(Boolean),
    };

    try {
      if (currentProject) {
        const updated = await updateProject(currentProject._id, formattedData);
        setProjects(projects.map(p => p._id === currentProject._id ? updated : p));
        toast.success("Project updated successfully");
      } else {
        const created = await createProject(formattedData);
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
          <GlassCard key={proj._id} className="group flex flex-col h-full border-outline/10 hover:border-primary/20 transition-all duration-500 p-0 overflow-hidden">
            <div className="relative h-56 w-full overflow-hidden bg-surface-high">
              <Image 
                src={proj.image} 
                alt={proj.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />
              <div className="absolute top-4 left-4">
                 <span className="px-3 py-1 rounded-full bg-background/60 backdrop-blur-md border border-outline/10 text-[9px] font-display font-black uppercase tracking-widest text-primary">
                   {proj.type}
                 </span>
              </div>
            </div>
            
            <div className="p-8 flex flex-col flex-1">
              <h3 className="font-display font-black text-2xl mb-3 group-hover:text-primary transition-colors line-clamp-1">{proj.title}</h3>
              <p className="text-xs text-foreground/50 font-body line-relaxed line-clamp-3 mb-6 flex-1">{proj.desc}</p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                 {proj.tech.slice(0, 3).map((t: string, i: number) => (
                   <span key={i} className="text-[8px] font-display font-bold uppercase tracking-widest text-foreground/30 px-2 py-1 bg-surface-high/50 rounded-md border border-outline/5">
                     {t}
                   </span>
                 ))}
                 {proj.tech.length > 3 && (
                   <span className="text-[8px] font-display font-bold uppercase text-foreground/20 px-2 py-1">+{proj.tech.length - 3} more</span>
                 )}
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-outline/10">
                <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-foreground/30 hover:text-primary transition-all">
                   <ExternalLink size={18} />
                </a>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(proj)}
                    className="p-3 rounded-xl bg-surface-high/50 hover:bg-primary hover:text-surface-lowest transition-all"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(proj._id)}
                    className="p-3 rounded-xl bg-surface-high/50 hover:bg-red-500/10 text-red-500 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-background/90 backdrop-blur-xl animate-in fade-in duration-300">
          <GlassCard className="w-full max-w-5xl max-h-[90vh] overflow-y-auto relative p-0 border-outline/20 shadow-2xl custom-scrollbar">
            <div className="sticky top-0 z-10 bg-surface-low/80 backdrop-blur-md px-10 py-6 border-b border-outline/10 flex justify-between items-center">
              <div>
                <h2 className="font-display text-2xl font-black">{currentProject ? "Update Project" : "Launch Project"}</h2>
                <p className="text-[10px] font-display font-bold uppercase tracking-widest text-foreground/30 mt-1">Project Specification</p>
              </div>
              <button onClick={resetForm} className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center text-foreground/40 hover:text-foreground transition-all">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/30 pl-1">Project Title</label>
                  <input
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-surface-high/40 border border-outline/10 rounded-xl px-6 py-4 font-display font-bold text-lg focus:outline-none focus:border-primary transition-all"
                    placeholder="e.g. Quantum Engine"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/30 pl-1">Category</label>
                  <input
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-surface-high/40 border border-outline/10 rounded-xl px-6 py-4 font-body text-sm focus:outline-none focus:border-primary transition-all"
                    placeholder="e.g. Next.js SaaS"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/30 pl-1">Elevator Pitch (Short Description)</label>
                <textarea
                  value={formData.desc}
                  onChange={e => setFormData({ ...formData, desc: e.target.value })}
                  className="w-full bg-surface-high/40 border border-outline/10 rounded-xl px-6 py-4 font-body text-sm focus:outline-none focus:border-primary transition-all min-h-[100px] resize-none leading-relaxed"
                  placeholder="Summarize the project in 2-3 sentences..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/30 pl-1">Stack (Comma Separated)</label>
                  <div className="relative">
                     <Layers className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20" size={16} />
                     <input
                       value={formData.tech}
                       onChange={e => setFormData({ ...formData, tech: e.target.value })}
                       className="w-full bg-surface-high/40 border border-outline/10 rounded-xl pl-14 pr-6 py-4 font-body text-sm focus:outline-none focus:border-primary transition-all"
                       placeholder="React, Golang, Docker"
                       required
                     />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/30 pl-1">Deployment URL</label>
                  <div className="relative">
                     <ExternalLink className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20" size={16} />
                     <input
                       value={formData.link}
                       onChange={e => setFormData({ ...formData, link: e.target.value })}
                       className="w-full bg-surface-high/40 border border-outline/10 rounded-xl pl-14 pr-6 py-4 font-body text-sm focus:outline-none focus:border-primary transition-all"
                       placeholder="https://myapp.vercel.app"
                       required
                     />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/30 pl-1">Visual Identity (Cover)</label>
                <div className="bg-surface-high/20 border border-outline/10 rounded-2xl p-6">
                  <CloudinaryUpload
                    currentImage={formData.image}
                    onUpload={url => setFormData({ ...formData, image: url })}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-6">
                <AdminEditor 
                  label="Detailed Technical Overview"
                  value={formData.content}
                  onChange={(val) => setFormData({ ...formData, content: val })}
                  id="project-editor"
                />
              </div>

              <div className="pt-10 flex gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-surface-high text-foreground py-5 rounded-2xl font-display font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-surface-high/80 transition-all"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] bg-primary text-surface-lowest py-5 rounded-2xl font-display font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_0_30px_-5px_rgba(var(--primary-rgb),0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={18} />}
                  {isSubmitting ? "Processing..." : currentProject ? "Confirm Updates" : "Deploy Project"}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--outline);
          opacity: 0.1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
