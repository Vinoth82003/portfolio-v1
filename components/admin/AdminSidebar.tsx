"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FolderKanban, 
  Briefcase, 
  Settings, 
  LogOut, 
  Home,
  Code2,
  Sun,
  Moon,
  BookOpen,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { useTheme } from "next-themes";

const menuItems = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Blog Vault", href: "/admin/blog-editor", icon: BookOpen },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Case Studies", href: "/admin/case-study-editor", icon: Search },
  { name: "Experience", href: "/admin/experience", icon: Briefcase },
  { name: "Skills", href: "/admin/skills", icon: Code2 },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        toast.success("Logged out");
        router.push("/admin/login");
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-low border-r border-outline/10 flex flex-col z-30">
      <div className="p-8 border-b border-outline/10">
        <Link href="/" className="font-display font-bold text-xl tracking-tighter">
          ADMIN<span className="text-primary ml-0.5">.PANEL</span>
        </Link>
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 ml-5 rounded-full hover:bg-surface-high transition-colors"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg font-display text-sm font-bold uppercase tracking-widest transition-all group",
                isActive 
                  ? "bg-primary text-surface-lowest shadow-[0_0_20px_-5px_var(--primary)]" 
                  : "text-foreground/50 hover:text-foreground hover:bg-surface-high"
              )}
            >
              <item.icon size={18} className={cn("transition-transform group-hover:scale-110", isActive ? "" : "text-primary/50")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-outline/10 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg font-display text-sm font-bold uppercase tracking-widest text-foreground/50 hover:text-foreground hover:bg-surface-high transition-all"
        >
          <Home size={18} className="text-secondary/50" />
          Return Home
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-display text-sm font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all group"
        >
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          Logout
        </button>
      </div>
    </aside>
  );
}
