import { ReactNode } from "react";
import { cn } from "@/lib/utils"; // Assuming we have or will create this

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "primary" | "secondary" | "accent" | "none";
  hoverEffect?: boolean;
}

export default function GlassCard({
  children,
  className,
  glowColor = "none",
  hoverEffect = false,
}: GlassCardProps) {
  const glowClasses = {
    primary: "group-hover:shadow-[0_0_80px_-15px_var(--primary-dim)]",
    secondary: "group-hover:shadow-[0_0_80px_-15px_var(--secondary)]",
    accent: "group-hover:shadow-[0_0_80px_-15px_var(--accent)]",
    none: "",
  };

  return (
    <div
      className={cn(
        "relative rounded-xl border border-outline/10 bg-surface-low p-6 transition-all duration-300",
        hoverEffect ? "hover:-translate-y-1 hover:border-outline-variant group" : "",
        hoverEffect ? glowClasses[glowColor] : "",
        className
      )}
    >
      {/* Optional Inner Glow on top edge for depth */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {children}
    </div>
  );
}
