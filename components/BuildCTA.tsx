import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BuildCTAProps {
  href?: string;
  text?: string;
  className?: string;
}

export default function BuildCTA({ 
  href = "/contact", 
  text = "Build Project", 
  className 
}: BuildCTAProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative group inline-flex items-center justify-center gap-2 px-8 py-4 overflow-hidden rounded-md font-display font-bold uppercase tracking-widest text-sm text-surface-lowest shadow-[0_8px_24px_-8px_var(--primary-dim)] transition-all hover:shadow-[0_12px_32px_-8px_var(--primary)] hover:-translate-y-[2px]",
        className
      )}
    >
      {/* Base Gradient Layer */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary via-primary-dim to-secondary" />
      
      {/* Hover Bleed Layer */}
      <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-secondary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Content */}
      <span className="relative flex items-center gap-2">
        {text} 
        <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
