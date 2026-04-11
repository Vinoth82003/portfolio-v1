"use client";

import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Code2, Link, Upload, Terminal } from "lucide-react";
import { 
  createSkill, 
  updateSkill, 
  deleteSkill 
} from "@/lib/actions/skills";
import { toast } from "react-hot-toast";
import GlassCard from "@/components/GlassCard";
import CloudinaryUpload from "./CloudinaryUpload";
import Image from "next/image";
import { cn } from "@/lib/utils";

const categories = ["Frontend", "Backend", "Database", "Tools", "Design", "Soft Skills", "Other"];

// Helper to check if string is an HTML code snippet (like SVG or img tag)
const isCodeSnippet = (str: string) => str?.trim().startsWith("<");

// Skill Icon Renderer
const SkillIcon = ({ icon, name, className = "" }: { icon: string, name: string, className?: string }) => {
  if (!icon) return <Code2 className={className} />;
  
  if (isCodeSnippet(icon)) {
    return (
      <div 
        className={`w-full h-full flex items-center justify-center p-2 text-primary fill-current [&>svg]:w-full [&>svg]:h-full ${className}`}
        dangerouslySetInnerHTML={{ __html: icon }} 
      />
    );
  }

  let isValidURL = false;
  try {
    new URL(icon);
    isValidURL = true;
  } catch {
    isValidURL = icon.startsWith('/');
  }

  if (isValidURL) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <Image src={icon} alt={name} fill sizes="(max-width: 768px) 48px, 64px" className="object-contain p-2" />
      </div>
    );
  }

  return <Code2 className={className} />;
};

export default function SkillManagement({ initialSkills }: { initialSkills: any[] }) {
  const [skills, setSkills] = useState(initialSkills);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iconMode, setIconMode] = useState<"upload" | "link" | "svg">("upload");

  const [formData, setFormData] = useState({
    name: "",
    category: "Frontend",
    level: 0,
    icon: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Frontend",
      level: 0,
      icon: "",
    });
    setCurrentSkill(null);
    setIsEditing(false);
    setIconMode("upload");
  };

  const handleEdit = (skill: any) => {
    setCurrentSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level || 0,
      icon: skill.icon || "",
    });
    
    // Determine icon mode based on current icon value
    if (isCodeSnippet(skill.icon || "")) {
      setIconMode("svg");
    } else if (skill.icon?.startsWith("http") && !skill.icon.includes("cloudinary")) {
      setIconMode("link");
    } else {
      setIconMode("upload");
    }
    
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.icon) {
      toast.error("Skill icon is required");
      setIsSubmitting(false);
      return;
    }

    try {
      if (currentSkill) {
        const updated = await updateSkill(currentSkill._id, formData);
        setSkills(skills.map(s => s._id === currentSkill._id ? updated : s));
        toast.success("Skill updated");
      } else {
        const created = await createSkill(formData);
        setSkills([...skills, created]);
        toast.success("Skill added");
      }
      resetForm();
    } catch (error) {
      toast.error("Failed to save skill");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await deleteSkill(id);
      setSkills(skills.filter(s => s._id !== id));
      toast.success("Skill deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl font-black tracking-tight">Technical Arsenal</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 bg-primary text-surface-lowest px-6 py-3 rounded-lg font-display font-bold uppercase tracking-widest text-xs shadow-[0_0_20px_-5px_var(--primary)] hover:scale-105 transition-all"
        >
          <Plus size={16} /> Add Skill
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {skills.map((skill) => (
          <GlassCard key={skill._id} className="group flex flex-col items-center gap-4 text-center">
            <div className="relative w-12 h-12 bg-surface-high rounded-xl flex items-center justify-center text-primary overflow-hidden">
              <SkillIcon icon={skill.icon} name={skill.name} />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm mb-1">{skill.name}</h3>
              <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">{skill.category}</p>
            </div>
            
            {/* ProgressBar */}
            <div className="w-full bg-surface-lowest rounded-full h-1 mt-auto overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-1000" 
                style={{ width: `${skill.level}%` }} 
              />
            </div>

            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => handleEdit(skill)}
                className="p-2 rounded-lg bg-surface-high text-primary hover:scale-110 transition-all font-bold"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDelete(skill._id)}
                className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:scale-110 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
          <GlassCard className="w-full max-w-lg relative animate-in fade-in zoom-in duration-300 my-8">
            <button onClick={resetForm} className="absolute top-6 right-6 text-foreground/40 hover:text-foreground">
              <X size={24} />
            </button>
            
            <h2 className="font-display text-2xl font-black mb-8">
              {currentSkill ? "Edit Skill" : "New Skill"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-display font-bold uppercase tracking-widest text-foreground/40">Skill Name</label>
                  <input
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-surface-high border border-outline/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-body"
                    placeholder="e.g. Next.js"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-display font-bold uppercase tracking-widest text-foreground/40">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-surface-high border border-outline/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-body"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-display font-bold uppercase tracking-widest text-foreground/40">Proficiency (%)</label>
                  <span className="text-primary font-display font-bold">{formData.level}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.level}
                  onChange={e => setFormData({ ...formData, level: parseInt(e.target.value) })}
                  className="w-full accent-primary h-2 bg-surface-high rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-display font-bold uppercase tracking-widest text-foreground/40">Icon Handling</label>
                
                <div className="flex gap-2 p-1 bg-surface-high rounded-xl">
                  {[
                    { id: "upload", icon: Upload, label: "Cloudinary" },
                    { id: "link", icon: Link, label: "URL" },
                    { id: "svg", icon: Terminal, label: "Raw SVG" }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setIconMode(mode.id as any)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-display font-bold uppercase tracking-tighter transition-all",
                        iconMode === mode.id ? "bg-primary text-surface-lowest shadow-lg" : "text-foreground/40 hover:text-foreground hover:bg-surface-lowest"
                      )}
                    >
                      <mode.icon size={14} />
                      {mode.label}
                    </button>
                  ))}
                </div>

                <div className="min-h-[120px] p-4 bg-surface-high/50 border border-outline/5 rounded-xl">
                  {iconMode === "upload" && (
                    <CloudinaryUpload
                      currentImage={formData.icon}
                      onUpload={url => setFormData({ ...formData, icon: url })}
                    />
                  )}

                  {iconMode === "link" && (
                    <div className="space-y-2">
                      <input
                        value={formData.icon}
                        onChange={e => setFormData({ ...formData, icon: e.target.value })}
                        className="w-full bg-surface-high border border-outline/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-body"
                        placeholder="https://example.com/icon.png"
                      />
                      <p className="text-[8px] text-foreground/30 italic">Paste an external image URL here.</p>
                    </div>
                  )}

                  {iconMode === "svg" && (
                    <div className="space-y-2">
                      <textarea
                        value={formData.icon}
                        onChange={e => setFormData({ ...formData, icon: e.target.value })}
                        className="w-full bg-surface-high border border-outline/10 rounded-lg px-4 py-3 text-xs font-mono focus:outline-none focus:border-primary transition-all min-h-[100px]"
                        placeholder='<svg viewBox="0 0 24 24">...</svg>'
                      />
                      <p className="text-[8px] text-foreground/30 italic">Paste raw SVG code here. It will be rendered theme-aware.</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-surface-lowest py-4 rounded-xl font-display font-bold uppercase tracking-widest text-sm shadow-[0_0_30px_-5px_var(--primary)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : currentSkill ? "Update Architectural Component" : "Add to Arsenal"}
              </button>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
