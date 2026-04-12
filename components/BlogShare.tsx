"use client";

import { Twitter, Linkedin, Share2 } from "lucide-react";
import toast from "react-hot-toast";

interface BlogShareProps {
  title: string;
  slug: string;
}

export default function BlogShare({ title, slug }: BlogShareProps) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://portfolio.vinoths.com/blogs/${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="flex gap-3">
      <a 
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`} 
        target="_blank" 
        rel="noreferrer" 
        className="w-10 h-10 rounded-full border border-outline/10 flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/30 transition-colors"
      >
        <Twitter size={16} />
      </a>
      <a 
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} 
        target="_blank" 
        rel="noreferrer" 
        className="w-10 h-10 rounded-full border border-outline/10 flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/30 transition-colors"
      >
        <Linkedin size={16} />
      </a>
      <button 
        onClick={handleCopyLink} 
        className="w-10 h-10 rounded-full border border-outline/10 flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/30 transition-colors"
      >
        <Share2 size={16} />
      </button>
    </div>
  );
}
