"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, FolderOpen, PenSquare, Plus, TrendingUp, Eye, Clock } from "lucide-react";
import GlassCard from "@/components/GlassCard";

interface Stats { blogs: number; projects: number; caseStudies: number; }

const NAV = [
  { label: "Blog Posts", href: "/admin/blog-editor", icon: <PenSquare size={18} />, color: "text-primary" },
  { label: "Projects", href: "/admin/projects", icon: <FolderOpen size={18} />, color: "text-secondary" },
  { label: "Case Studies", href: "/admin/case-study-editor", icon: <BookOpen size={18} />, color: "text-accent" },
];

const FADE_UP = (i: number) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
});

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ blogs: 0, projects: 0, caseStudies: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/blogs").then(r => r.json()).catch(() => ({ count: 0 })),
      fetch("/api/admin/projects").then(r => r.json()).catch(() => ({ count: 0 })),
      fetch("/api/admin/case-studies").then(r => r.json()).catch(() => ({ count: 0 })),
    ]).then(([blogs, projects, cases]) => {
      setStats({ blogs: blogs.count ?? 0, projects: projects.count ?? 0, caseStudies: cases.count ?? 0 });
      setLoading(false);
    });
  }, []);

  const STAT_CARDS = [
    { label: "Blog Posts", value: stats.blogs, icon: <PenSquare size={20} />, color: "text-primary", bg: "bg-primary/10" },
    { label: "Projects", value: stats.projects, icon: <FolderOpen size={20} />, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "Case Studies", value: stats.caseStudies, icon: <BookOpen size={20} />, color: "text-accent", bg: "bg-accent/10" },
    { label: "Total Views", value: "—", icon: <Eye size={20} />, color: "text-foreground/40", bg: "bg-surface-highest/10" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-surface-low border-r border-outline/10 flex flex-col z-40 p-6">
        <div className="mb-10">
          <Link href="/" className="font-display font-black text-xl tracking-tighter">
            VINOTH<span className="text-primary">.S</span>
          </Link>
          <p className="font-display text-[9px] uppercase tracking-widest text-foreground/35 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 space-y-2">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-background/60 transition-all group font-display text-sm font-bold tracking-wide">
              <span className={`${item.color} transition-colors`}>{item.icon}</span>
              <span className="text-foreground/70 group-hover:text-foreground transition-colors">{item.label}</span>
            </Link>
          ))}
        </nav>
        <Link href="/" className="flex items-center gap-2 font-display text-[9px] uppercase tracking-widest text-foreground/30 hover:text-primary transition-colors px-4 py-2">
          <Eye size={12} /> View Site
        </Link>
      </div>

      {/* Main Content */}
      <main className="ml-64 p-10">
        <div className="max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
            <p className="font-display text-primary uppercase tracking-[0.3em] text-[10px] font-bold mb-3">Admin</p>
            <h1 className="font-display text-4xl font-black tracking-tighter">Dashboard</h1>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {STAT_CARDS.map((card, i) => (
              <motion.div key={card.label} variants={FADE_UP(i)} initial="hidden" animate="visible">
                <GlassCard className="text-center">
                  <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center mx-auto mb-4 ${card.color}`}>
                    {card.icon}
                  </div>
                  <p className="font-display font-black text-3xl mb-1">{loading ? "—" : card.value}</p>
                  <p className="font-display text-[9px] uppercase tracking-widest text-foreground/40">{card.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div variants={FADE_UP(4)} initial="hidden" animate="visible" className="mb-12">
            <h2 className="font-display font-black text-xl tracking-tighter mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {NAV.map((item) => (
                <Link key={item.href} href={`${item.href}?mode=new`}>
                  <GlassCard hoverEffect glowColor="primary" className="flex items-center gap-4">
                    <div className={`w-10 h-10 bg-background rounded-lg flex items-center justify-center ${item.color}`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-display font-bold text-sm mb-0.5">New {item.label.replace(/s$/, "")}</p>
                      <p className="font-body text-xs text-foreground/40">Create &amp; publish</p>
                    </div>
                    <Plus size={16} className="text-foreground/30" />
                  </GlassCard>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Activity Feed placeholder */}
          <motion.div variants={FADE_UP(6)} initial="hidden" animate="visible">
            <h2 className="font-display font-black text-xl tracking-tighter mb-6">Recent Activity</h2>
            <GlassCard>
              <div className="flex items-center gap-3 py-4 text-foreground/30">
                <Clock size={16} />
                <p className="font-body text-sm">No recent activity yet. Start by creating your first post.</p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
