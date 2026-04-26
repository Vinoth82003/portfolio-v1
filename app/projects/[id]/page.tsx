import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github, ChevronRight, Layers, LayoutTemplate, Activity } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import BuildCTA from "@/components/BuildCTA";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";


import { getProjectById, getProjects } from "@/lib/actions/projects";

export async function generateStaticParams() {
  const projects = await getProjects(true);
  return projects.map((proj: any) => ({ id: proj.id || proj._id.toString() }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const proj = await getProjectById(id, true);
  if (!proj) return { title: "Project Not Found" };
  return { title: `${proj.title} | Vinoth S`, description: proj.description };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const proj = await getProjectById(id, true);
  if (!proj) notFound();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Dynamic Hero Section */}
        <div className="relative h-[70vh] min-h-[600px] overflow-hidden flex flex-col justify-end">
          {proj.image && (
            <Image 
              src={proj.image} 
              alt={proj.title} 
              fill 
              sizes="100vw" 
              className="object-cover scale-105 animate-[slow-zoom_20s_ease-in-out_infinite_alternate]" 
              priority 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.15),transparent_50%)] z-10 mix-blend-screen" />
          
          <div className="relative z-20 px-6 md:px-16 pb-20 max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
              <div className="max-w-4xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-display text-primary uppercase tracking-[0.35em] text-[10px] font-black bg-primary/10 px-4 py-1.5 rounded-sm border border-primary/20 backdrop-blur-md">
                    {proj.type}
                  </span>
                  <span className="font-display text-foreground/40 uppercase tracking-[0.2em] text-[10px] font-bold">
                    {proj.year}
                  </span>
                </div>
                <h1 className="font-display text-6xl md:text-8xl lg:text-[8rem] font-black tracking-tighter mb-6 leading-[0.9] drop-shadow-2xl">
                  {proj.title}
                </h1>
                <p className="font-body text-foreground/60 text-lg md:text-xl max-w-2xl leading-relaxed border-l-2 border-primary/50 pl-6 py-2">
                  {proj.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-16 pb-32">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-8 border-b border-outline/10 gap-6 -mt-10 relative z-30 bg-background/50 backdrop-blur-xl rounded-t-3xl px-8 shadow-2xl">
            <Link href="/projects" className="group inline-flex items-center gap-2 font-display text-[10px] uppercase tracking-[0.2em] text-foreground/40 hover:text-primary transition-colors">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Platform Directory
            </Link>
            <div className="flex flex-wrap gap-4">
              {proj.github && (
                <a href={proj.github} target="_blank" rel="noreferrer"
                  className="group relative overflow-hidden bg-surface-high/50 border border-outline/20 px-6 py-3.5 rounded-xl font-display font-black text-[10px] uppercase tracking-widest transition-all hover:border-foreground/30 flex items-center gap-2">
                  <div className="absolute inset-0 w-0 bg-foreground/5 group-hover:w-full transition-all duration-300 ease-out" />
                  <span className="relative z-10 flex items-center gap-2 text-foreground/80 group-hover:text-foreground"><Github size={16} /> Repository</span>
                </a>
              )}
              {proj.link && (
                <a href={proj.link} target="_blank" rel="noreferrer"
                  className="group relative overflow-hidden bg-primary text-surface-lowest px-6 py-3.5 rounded-xl font-display font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_-5px_rgba(var(--primary-rgb),0.5)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                  <div className="absolute inset-0 w-0 bg-white/20 group-hover:w-full transition-all duration-300 ease-out" />
                  <span className="relative z-10 flex items-center gap-2"><ExternalLink size={16} /> Live Deployment</span>
                </a>
              )}
            </div>
          </div>

          {/* Architecture Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 pt-20">
            {/* Main Narrative */}
            <div className="lg:col-span-8 space-y-24">
              {/* Overview */}
              {proj.overview && (
                <section className="relative group">
                  <div className="absolute -left-10 top-0 bottom-0 w-1 bg-outline/5 rounded-full group-hover:bg-primary/20 transition-colors hidden md:block" />
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center text-foreground/30 group-hover:text-primary transition-colors border border-outline/10">
                        <LayoutTemplate size={18} />
                     </div>
                     <h2 className="font-display text-[11px] uppercase tracking-[0.3em] text-foreground/50 font-black">Architecture Overview</h2>
                  </div>
                  <div className="max-w-none">
                    <MarkdownRenderer content={proj.overview} />
                  </div>
                </section>
              )}

              {/* Challenge */}
              {proj.challenge && (
                <section className="relative group">
                  <div className="absolute -left-10 top-0 bottom-0 w-1 bg-outline/5 rounded-full group-hover:bg-error/20 transition-colors hidden md:block" />
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center text-foreground/30 group-hover:text-error transition-colors border border-outline/10">
                        <Activity size={18} />
                     </div>
                     <h2 className="font-display text-[11px] uppercase tracking-[0.3em] text-foreground/50 font-black">The Challenge</h2>
                  </div>
                  <div className="max-w-none">
                    <MarkdownRenderer content={proj.challenge} />
                  </div>
                </section>
              )}

              {/* Solution */}
              {proj.solution && (
                <GlassCard hoverEffect={false} className="border-primary/20 p-10 md:p-14 relative overflow-hidden bg-surface-low border-2 shadow-[0_20px_40px_-20px_rgba(var(--primary-rgb),0.1)]">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
                  <div className="flex items-center gap-4 mb-10 relative z-10">
                     <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Layers size={22} />
                     </div>
                     <div>
                       <h2 className="font-display text-[11px] uppercase tracking-[0.3em] text-primary font-black mb-1">Implementation</h2>
                       <p className="font-display text-2xl font-black text-foreground">The Solution</p>
                     </div>
                  </div>
                  <div className="max-w-none relative z-10 selection:bg-primary/30">
                    <MarkdownRenderer content={proj.solution} />
                  </div>
                </GlassCard>
              )}

              {/* Outcome */}
              {proj.outcome && (
                <section className="relative group">
                  <div className="absolute -left-10 top-0 bottom-0 w-1 bg-outline/5 rounded-full group-hover:bg-green-500/20 transition-colors hidden md:block" />
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center text-foreground/30 group-hover:text-green-500 transition-colors border border-outline/10">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                     </div>
                     <h2 className="font-display text-[11px] uppercase tracking-[0.3em] text-foreground/50 font-black">Business Impact</h2>
                  </div>
                  <div className="text-xl md:text-2xl font-display font-black leading-snug text-foreground/90 pl-6 border-l-4 border-foreground/10 py-2">
                    <MarkdownRenderer content={proj.outcome} />
                  </div>
                </section>
              )}
            </div>

            {/* Sticky Sidebar */}
            <aside className="lg:col-span-4 space-y-8 relative">
              <div className="sticky top-28 space-y-8">
                <GlassCard hoverEffect glowColor="primary" className="p-8">
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-outline/10">
                     <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                     <h3 className="font-display text-[10px] uppercase tracking-[0.3em] text-foreground/50 font-black">Infrastructure Stack</h3>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {Array.isArray(proj.tech) && proj.tech.map((t: string) => (
                      <span key={t} className="bg-surface-highest/50 text-foreground/80 text-[10px] font-display font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg border border-outline/5 hover:border-primary/30 hover:bg-surface-highest transition-all cursor-default">
                        {t}
                      </span>
                    ))}
                  </div>
                </GlassCard>

                <div className="relative group overflow-hidden rounded-3xl p-[1px] bg-gradient-to-b from-outline/20 to-transparent">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="bg-surface-low rounded-3xl p-10 h-full relative z-10 flex flex-col items-center text-center">
                    <p className="font-display text-[10px] uppercase tracking-[0.3em] text-primary font-black mb-6">Build With Me</p>
                    <h4 className="font-display text-2xl font-black mb-4">Want to build something similar?</h4>
                    <p className="font-body text-sm text-foreground/50 mb-8 leading-relaxed">Let's architect your next digital product with scalable infrastructure and premium aesthetics.</p>
                    <BuildCTA text="Start Project" href="/contact" className="w-full" />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-4 text-foreground/20 font-display text-[9px] uppercase tracking-widest font-black">
                   <span>&copy; {new Date().getFullYear()}</span>
                   <div className="w-1 h-1 rounded-full bg-foreground/20" />
                   <span>Vinoth S</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
      `}} />
    </div>
  );
}
