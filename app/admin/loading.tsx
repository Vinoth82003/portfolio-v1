import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 w-16 h-16 bg-primary/20 blur-xl animate-pulse rounded-full" />
        <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
      </div>
      <p className="mt-6 font-display text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/40 animate-pulse">
        Architecting Module...
      </p>
    </div>
  );
}
