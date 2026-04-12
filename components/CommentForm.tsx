"use client";

import { useState } from "react";
import { Send, User, Mail, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";
import { addComment } from "@/lib/actions/comments";
import { cn } from "@/lib/utils";

interface CommentFormProps {
  blogId: string;
  onSuccess?: () => void;
}

export default function CommentForm({ blogId, onSuccess }: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    content: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.content) {
      toast.error("Please fill in name and comment");
      return;
    }

    setIsSubmitting(true);
    try {
      await addComment(blogId, formData.name, formData.content, formData.email || undefined);
      toast.success("Thought shared! Thank you.");
      setFormData({ name: "", email: "", content: "" });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="name" className="block font-display text-[10px] uppercase tracking-widest text-foreground/40 font-bold mb-2 ml-1">Name *</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" size={16} />
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
              required
              className="w-full bg-surface-low border border-outline/10 focus:border-primary/40 rounded-xl py-3.5 pl-11 pr-4 outline-none transition-all font-body text-sm"
            />
          </div>
        </div>
        <div className="relative">
          <label htmlFor="email" className="block font-display text-[10px] uppercase tracking-widest text-foreground/40 font-bold mb-2 ml-1">Email <span className="normal-case">(Optional)</span></label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" size={16} />
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              className="w-full bg-surface-low border border-outline/10 focus:border-primary/40 rounded-xl py-3.5 pl-11 pr-4 outline-none transition-all font-body text-sm"
            />
          </div>
        </div>
      </div>

      <div className="relative">
        <label htmlFor="content" className="block font-display text-[10px] uppercase tracking-widest text-foreground/40 font-bold mb-2 ml-1">Share Your Thoughts *</label>
        <div className="relative group">
          <MessageSquare className="absolute left-4 top-5 text-primary/40 group-focus-within:text-primary transition-colors" size={16} />
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="What's on your mind?..."
            required
            rows={4}
            className="w-full bg-surface-low border border-outline/10 focus:border-primary/40 rounded-xl py-3.5 pl-11 pr-4 outline-none transition-all font-body text-sm resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full bg-gradient-to-r from-primary to-primary-dim text-white font-display font-bold uppercase tracking-[0.2em] text-xs py-4 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] flex items-center justify-center gap-2",
          isSubmitting && "opacity-70 cursor-not-allowed"
        )}
      >
        {isSubmitting ? "Posting..." : (
          <>
            Post Comment <Send size={14} />
          </>
        )}
      </button>
    </form>
  );
}
