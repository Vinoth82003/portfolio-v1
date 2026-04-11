"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Briefcase } from "lucide-react";
import { 
  createExperience, 
  updateExperience, 
  deleteExperience 
} from "@/lib/actions/experience";
import { toast } from "react-hot-toast";
import GlassCard from "@/components/GlassCard";

export default function ExperienceManagement({ initialExperiences }: { initialExperiences: any[] }) {
  const [experiences, setExperiences] = useState(initialExperiences);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExp, setCurrentExp] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    period: "",
    description: "",
    technologies: "",
    isCurrent: false,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      period: "",
      description: "",
      technologies: "",
      isCurrent: false,
    });
    setCurrentExp(null);
    setIsEditing(false);
  };

  const handleEdit = (exp: any) => {
    setCurrentExp(exp);
    setFormData({
      title: exp.title,
      company: exp.company,
      location: exp.location || "",
      period: exp.period,
      description: exp.description,
      technologies: exp.technologies ? exp.technologies.join(", ") : "",
      isCurrent: exp.isCurrent || false,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedData = {
      ...formData,
      technologies: formData.technologies.split(",").map(t => t.trim()).filter(Boolean),
    };

    try {
      if (currentExp) {
        const updated = await updateExperience(currentExp._id, formattedData);
        setExperiences(experiences.map(e => e._id === currentExp._id ? updated : e));
        toast.success("Experience updated");
      } else {
        const created = await createExperience(formattedData);
        setExperiences([created, ...experiences]);
        toast.success("Experience created");
      }
      resetForm();
    } catch (error) {
      toast.error("Failed to save experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    try {
      await deleteExperience(id);
      setExperiences(experiences.filter(e => e._id !== id));
      toast.success("Experience deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl font-black tracking-tight">Professional History</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 bg-secondary text-surface-lowest px-6 py-3 rounded-lg font-display font-bold uppercase tracking-widest text-xs shadow-[0_0_20px_-5px_var(--secondary)] hover:scale-105 transition-all"
        >
          <Plus size={16} /> Add Experience
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {experiences.map((exp) => (
          <GlassCard key={exp._id} className="group">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-surface-high rounded-xl flex items-center justify-center text-primary shrink-0">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold mb-1">{exp.title}</h3>
                  <p className="text-primary font-bold uppercase tracking-wider text-xs mb-2">{exp.company}</p>
                  <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em] mb-4">{exp.period}</p>
                  <p className="text-sm text-foreground/60 font-body leading-relaxed max-w-2xl">{exp.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-outline/10 pt-4 md:pt-0 md:pl-6">
                <button
                  onClick={() => handleEdit(exp)}
                  className="p-2 rounded-lg hover:bg-surface-high text-foreground/40 hover:text-primary transition-all"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(exp._id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-300">
            <button onClick={resetForm} className="absolute top-6 right-6 text-foreground/40 hover:text-foreground">
              <X size={24} />
            </button>
            
            <h2 className="font-display text-2xl font-black mb-8">
              {currentExp ? "Edit Experience" : "New Experience"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-display font-bold uppercase tracking-widest text-foreground/40">Job Title</label>
                  <input
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-surface-high border border-outline/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                    placeholder="e.g. Senior Developer"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-display font-bold uppercase tracking-widest text-foreground/40">Company</label>
                  <input
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-surface-high border border-outline/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                    placeholder="e.g. Google"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-display font-bold uppercase tracking-widest text-foreground/40">Location</label>
                  <input
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-surface-high border border-outline/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                    placeholder="e.g. Remote"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-display font-bold uppercase tracking-widest text-foreground/40">Period</label>
                  <input
                    value={formData.period}
                    onChange={e => setFormData({ ...formData, period: e.target.value })}
                    className="w-full bg-surface-high border border-outline/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                    placeholder="e.g. 2021 - Present"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-display font-bold uppercase tracking-widest text-foreground/40">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-surface-high border border-outline/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all min-h-[120px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-display font-bold uppercase tracking-widest text-foreground/40">Technologies Used (comma separated)</label>
                <input
                  value={formData.technologies}
                  onChange={e => setFormData({ ...formData, technologies: e.target.value })}
                  className="w-full bg-surface-high border border-outline/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                  placeholder="React, AWS, Node.js"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isCurrent"
                  checked={formData.isCurrent}
                  onChange={e => setFormData({ ...formData, isCurrent: e.target.checked })}
                  className="w-4 h-4 rounded border-outline/10 bg-surface-high text-primary focus:ring-primary"
                />
                <label htmlFor="isCurrent" className="text-xs font-display font-bold uppercase tracking-widest text-foreground/60">Current Position</label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary text-surface-lowest py-4 rounded-lg font-display font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_-5px_var(--secondary)] hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : currentExp ? "Update Entry" : "Add Entry"}
              </button>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
