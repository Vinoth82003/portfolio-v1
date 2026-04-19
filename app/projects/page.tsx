import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ArrowLeft, ArrowRight, ArrowUpRight, Zap, Github } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BuildCTA from "@/components/BuildCTA";
import GlassCard from "@/components/GlassCard";

export const metadata: Metadata = {
  title: "Projects | Vinoth S – Digital Architect",
  description: "Explore the full portfolio of projects built by Vinoth S – full stack web applications with modern architecture.",
};

import { getProjects } from "@/lib/actions/projects";

export default async function ProjectsPage() {
  const PROJECTS = await getProjects() as any[];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20 overflow-hidden">
        {/* Header */}
        <section className="px-6 md:px-16 max-w-[1400px] mx-auto mb-24 relative">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full -z-10 pointer-events-none mix-blend-screen" />
          <div className="absolute top-[20%] left-[-10%] w-[300px] h-[300px] bg-secondary/10 blur-[120px] rounded-full -z-10 pointer-events-none mix-blend-screen" />
          
          <Link href="/" className="group inline-flex items-center gap-3 font-display text-[10px] uppercase tracking-[0.2em] text-foreground/40 hover:text-primary transition-colors mb-12">
            <div className="w-8 h-8 rounded-full border border-outline/10 flex items-center justify-center bg-surface-lowest group-hover:border-primary/30 transition-colors">
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            </div>
            Base Directory
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="max-w-3xl relative">
              <div className="absolute -left-6 top-4 bottom-4 w-1 bg-gradient-to-b from-primary to-transparent rounded-full hidden md:block opacity-50" />
              <p className="font-display text-primary uppercase tracking-[0.4em] text-[10px] font-black mb-6 flex items-center gap-2">
                 <Zap size={12} className="text-secondary" /> Project Portfolio
              </p>
              <h1 className="font-display text-6xl md:text-8xl lg:text-[8rem] font-black tracking-tighter mb-8 leading-[0.9] drop-shadow-lg text-foreground">
                Digital <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-foreground/40">Architectures</span>
              </h1>
              <p className="text-foreground/50 font-body text-xl max-w-2xl leading-relaxed">
                A definitive collection of production-grade systems, aesthetic interfaces, and scalable full-stack applications.
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-foreground/30 font-display text-[10px] uppercase tracking-widest font-bold pb-2">
               <div className="w-8 h-px bg-outline/20" />
               Index: {PROJECTS.length} Builds
            </div>
          </div>
        </section>

        {/* Project Grid */}
        <section className="px-6 md:px-16 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {PROJECTS.map((proj, i) => (
              <Link key={proj.id} href={`/projects/${proj.id}`} className="group block focus:outline-none">
                <GlassCard hoverEffect glowColor="primary" className="p-0 overflow-hidden h-full flex flex-col hover:border-primary/30 transition-all duration-500">
                  <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden bg-surface-highest">
                    <Image
                      src={proj.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c"}
                      alt={proj.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    />
                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-screen" />

                    {/* Top Bar */}
                    <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                       <span className="bg-background/80 backdrop-blur-md text-foreground font-display font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-xl border border-outline/10">
                         {proj.type}
                       </span>
                       <span className="bg-surface-highest/80 backdrop-blur-md text-foreground/50 font-display font-bold text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-sm border border-outline/5">
                         {proj.year}
                       </span>
                    </div>

                    {/* Hover Explorer icon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-primary/90 text-surface-lowest flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500 ease-out shadow-[0_0_40px_rgba(var(--primary-rgb),0.5)] z-20 backdrop-blur-sm">
                       <ArrowUpRight size={24} strokeWidth={3} />
                    </div>
                  </div>

                  <div className="p-8 md:p-10 flex flex-col flex-1 relative z-10 bg-gradient-to-b from-background to-surface-low">
                    <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight mb-4 group-hover:text-primary transition-colors">{proj.title}</h2>
                    <p className="text-foreground/50 leading-relaxed font-body text-sm mb-8 flex-1 line-clamp-3 group-hover:text-foreground/70 transition-colors">{proj.description}</p>
                    
                    <div className="flex flex-wrap gap-2 pt-6 border-t border-outline/10">
                      {Array.isArray(proj.tech) && proj.tech.slice(0, 4).map((t: string) => (
                        <span key={t} className="text-[9px] uppercase tracking-[0.1em] text-foreground/40 group-hover:text-foreground/60 bg-surface-highest/50 px-3 py-1.5 rounded border border-outline/5 font-display font-bold transition-colors">
                          {t}
                        </span>
                      ))}
                      {Array.isArray(proj.tech) && proj.tech.length > 4 && (
                        <span className="text-[9px] uppercase tracking-[0.1em] text-foreground/30 px-2 py-1.5 font-display font-bold">
                          +{proj.tech.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </section>

        {/* Unified CTA */}
        <section className="px-6 md:px-16 max-w-[1400px] mx-auto mt-32">
          <div className="relative group overflow-hidden rounded-[2.5rem] bg-surface-low border border-outline/10 p-12 md:p-20 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 opacity-50 block" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen animate-pulse" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <p className="font-display text-primary uppercase tracking-[0.4em] text-[10px] font-black mb-6">Collaboration</p>
              <h3 className="font-display text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">Identify a missing piece?</h3>
              <p className="font-body text-foreground/50 text-lg mb-10 leading-relaxed">If there's an engineering challenge you need solved, let's architect a solution together.</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <BuildCTA text="Initialize Project" href="/contact" />
                <a href="https://github.com/Vinoth82003" target="_blank" rel="noreferrer"
                  className="w-full sm:w-auto border border-outline/20 px-8 py-4 rounded-xl font-display font-black uppercase tracking-widest text-[10px] hover:bg-surface-highest hover:border-outline/40 transition-all flex items-center justify-center gap-3 bg-surface-low/50 backdrop-blur-md">
                  <Github size={16} /> Explore GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
