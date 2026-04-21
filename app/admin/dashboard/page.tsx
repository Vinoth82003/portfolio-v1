import { Suspense } from "react";
import connectToDatabase from "@/lib/db/mongodb";
import CaseStudy from "@/models/CaseStudy";
import Blog from "@/models/Blog";
import ContactMessage from "@/models/ContactMessage";
import Experience from "@/models/Experience";
import Skill from "@/models/Skill";
import Project from "@/models/Project";
import GlassCard from "@/components/GlassCard";
import { MessageSquare, FolderKanban, Briefcase, Code2, TrendingUp, BookOpen, Search } from "lucide-react";
import { StatCardSkeleton } from "@/components/admin/AdminSkeleton";

import EngagementCharts from "@/components/admin/EngagementCharts";

async function StatsContent() {
  await connectToDatabase();
  
  const [projectCount, blogCount, caseStudyCount, messageCount, unreadMessages, skillCount] = await Promise.all([
    Project.countDocuments(),
    Blog.countDocuments(),
    CaseStudy.countDocuments(),
    ContactMessage.countDocuments(),
    ContactMessage.countDocuments({ status: "UNREAD" }),
    Skill.countDocuments(),
  ]);

  const statCards = [
    { title: "Projects", value: projectCount, icon: FolderKanban, color: "primary" },
    { title: "Blogs", value: blogCount, icon: BookOpen, color: "secondary" },
    { title: "Case Studies", value: caseStudyCount, icon: Search, color: "accent" },
    { title: "Skills", value: skillCount, icon: Code2, color: "primary" },
    { title: "Messages", value: unreadMessages, icon: MessageSquare, color: "secondary" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {statCards.map((stat) => (
        <GlassCard key={stat.title} hoverEffect glowColor={stat.color as any}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-surface-high rounded-lg text-primary">
              <stat.icon size={24} />
            </div>
            <TrendingUp size={16} className="text-success" />
          </div>
          <p className="text-xs font-display font-bold uppercase tracking-widest text-foreground/40 mb-1">
            {stat.title}
          </p>
          <p className="text-4xl font-display font-black tracking-tight">{stat.value}</p>
        </GlassCard>
      ))}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-display text-4xl font-black tracking-tighter mb-2">System Overview</h1>
        <p className="text-foreground/50 font-body">Real-time status of your digital environment.</p>
      </header>

      <Suspense fallback={<DashboardSkeleton />}>
        <StatsContent />
      </Suspense>

      <div className="space-y-8">
        <header>
          <h2 className="font-display text-2xl font-bold tracking-tight mb-2 text-primary">User Engagement</h2>
          <p className="text-foreground/50 font-body text-sm">Insights into how users are interacting with your portfolio.</p>
        </header>
        
        <Suspense fallback={<div className="h-[400px] flex items-center justify-center bg-surface-low rounded-3xl border border-outline/10">Loading insights...</div>}>
          <EngagementCharts />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-1">
          <h3 className="font-display font-bold text-lg mb-6">System Health</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-body text-foreground/60">Database Connection</span>
              <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-body text-foreground/60">Cloudinary API</span>
              <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-body text-foreground/60">Redis Cache</span>
              <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Operational</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
