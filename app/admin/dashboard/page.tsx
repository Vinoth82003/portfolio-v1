"use client";

import { useRouter } from "next/navigation";
import GlassCard from "@/components/GlassCard";
import Navbar from "@/components/Navbar";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Logged out successfully");
        router.push("/admin/login");
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-zinc-400">Welcome back, Admin</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500/10 px-4 py-2 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <GlassCard className="flex flex-col items-center justify-center p-8 text-center" hoverEffect glowColor="primary">
            <h2 className="text-xl font-semibold mb-2">Projects</h2>
            <p className="text-zinc-500 mb-6 font-mono">Coming Soon</p>
            <button className="rounded-full bg-zinc-800 px-6 py-2 text-sm hover:bg-zinc-700 transition-all">Manage</button>
          </GlassCard>

          <GlassCard className="flex flex-col items-center justify-center p-8 text-center" hoverEffect glowColor="secondary">
            <h2 className="text-xl font-semibold mb-2">Blogs</h2>
            <p className="text-zinc-500 mb-6 font-mono">Coming Soon</p>
            <button className="rounded-full bg-zinc-800 px-6 py-2 text-sm hover:bg-zinc-700 transition-all">Manage</button>
          </GlassCard>

          <GlassCard className="flex flex-col items-center justify-center p-8 text-center" hoverEffect glowColor="accent">
            <h2 className="text-xl font-semibold mb-2">Settings</h2>
            <p className="text-zinc-500 mb-6 font-mono">Coming Soon</p>
            <button className="rounded-full bg-zinc-800 px-6 py-2 text-sm hover:bg-zinc-700 transition-all">Manage</button>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
