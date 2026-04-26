import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Clock, BookOpen, Layers } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import BuildCTA from "@/components/BuildCTA";

export const metadata: Metadata = {
  title: "Case Studies | Vinoth S – Digital Architect",
  description: "Deep dive technical case studies on scalable backend architecture, Redis, MongoDB, and full-stack product development.",
};

export const dynamic = "force-dynamic";

import { getCaseStudies } from "@/lib/actions/case-studies";

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies(true) as any[];
  
  if (caseStudies.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-40 pb-32 text-center max-w-xl mx-auto px-6">
          <BookOpen size={64} className="mx-auto text-foreground/10 mb-8" strokeWidth={1} />
          <h2 className="font-display font-black text-3xl mb-4">No Documentation Yet</h2>
          <p className="font-body text-foreground/50 mb-10 leading-relaxed">Technical deep dives and architectural case studies will be published here soon.</p>
          <Link href="/" className="inline-flex bg-secondary text-surface-lowest px-8 py-4 rounded-xl font-display font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_-5px_rgba(var(--secondary-rgb),0.5)] hover:scale-105 transition-all">Return to Core</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const [featured, ...rest] = caseStudies;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-28 overflow-hidden">
        {/* Header Segment */}
        <section className="px-6 md:px-16 max-w-[1400px] mx-auto mb-20 relative">
          <div className="absolute top-[-10%] right-[0%] w-[600px] h-[600px] bg-secondary/10 blur-[150px] rounded-full -z-10 pointer-events-none mix-blend-screen animate-pulse" />
          
          <Link href="/" className="group inline-flex items-center gap-3 font-display text-[10px] uppercase tracking-[0.2em] text-foreground/40 hover:text-secondary transition-colors mb-12">
            <div className="w-8 h-8 rounded-full border border-outline/10 flex items-center justify-center bg-surface-lowest group-hover:border-secondary/30 transition-colors">
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            </div>
            Base Directory
          </Link>
          
          <div className="max-w-4xl relative">
            <div className="absolute -left-6 top-4 bottom-4 w-1 bg-gradient-to-b from-secondary to-transparent rounded-full hidden md:block opacity-50" />
            <p className="font-display text-secondary uppercase tracking-[0.4em] text-[10px] font-black mb-6 flex items-center gap-2">
               <Layers size={12} className="text-secondary" /> Knowledge Base
            </p>
            <h1 className="font-display text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] drop-shadow-lg text-foreground">
              Engineering <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-dim via-secondary to-secondary-dim">{"_"}Case Studies{"_"}</span>
            </h1>
            <p className="text-foreground/50 font-body text-xl max-w-2xl leading-relaxed">
              In-depth technical analyses into the decisions, constraints, patterns, and tradeoffs behind complex production systems.
            </p>
          </div>
        </section>

        {/* Hero Featured Case Study */}
        {featured && (
          <section className="px-6 md:px-16 max-w-[1400px] mx-auto mb-24 relative z-10">
            <Link href={`/case-studies/${featured.id}`} className="group block outline-none">
              <div className="relative rounded-[2.5rem] overflow-hidden border border-outline/10 group-hover:border-secondary/30 transition-all duration-500 shadow-2xl bg-surface-low">
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                  <div className="relative h-80 lg:h-auto overflow-hidden bg-surface-highest">
                    <Image 
                      src={featured.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f"} 
                      alt={featured.title} 
                      fill 
                      sizes="(max-width: 1024px) 100vw, 50vw" 
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105" 
                      priority 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 lg:bg-gradient-to-r lg:from-transparent lg:via-background/40 lg:to-background pointer-events-none" />
                  </div>
                  
                  <div className="p-10 md:p-16 flex flex-col justify-center relative z-10 bg-gradient-to-t from-background to-transparent lg:to-background pb-12">
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                      <span className="bg-secondary/10 text-secondary font-display font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-sm border border-secondary/20 shadow-sm">
                        {featured.category}
                      </span>
                      <span className="flex items-center gap-1.5 font-display text-[10px] uppercase tracking-widest text-foreground/45 font-bold">
                        <Clock size={12} className="text-secondary/70" /> {featured.readTime}
                      </span>
                    </div>
                    
                    <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight group-hover:text-secondary transition-colors drop-shadow-md pb-1">{featured.title}</h2>
                    <p className="text-foreground/50 font-body text-lg leading-relaxed mb-10 line-clamp-3">
                      {featured.description}
                    </p>
                    
                    <div className="mt-auto inline-flex items-center gap-3 font-display font-black text-[10px] uppercase tracking-widest text-surface-lowest bg-secondary px-8 py-4 rounded-xl w-fit shadow-[0_0_20px_-5px_rgba(var(--secondary-rgb),0.5)] group-hover:scale-105 active:scale-95 transition-all">
                      Read Documentation <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Index of Case Studies */}
        {rest.length > 0 && (
          <section className="px-6 md:px-16 max-w-[1400px] mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <h3 className="font-display text-2xl font-black">Archive</h3>
              <div className="h-px flex-1 bg-outline/10" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((cs) => (
                <Link key={cs.id} href={`/case-studies/${cs.id}`} className="group block h-full outline-none">
                  <GlassCard hoverEffect glowColor="secondary" className="h-full flex flex-col p-8 border-outline/10 group-hover:border-secondary/30">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="bg-secondary/10 text-secondary font-display font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded border border-secondary/20">
                        {cs.category}
                      </span>
                      <span className="flex items-center gap-1.5 font-display text-[9px] uppercase tracking-widest text-foreground/40 font-bold">
                        <Clock size={10} /> {cs.readTime}
                      </span>
                    </div>
                    
                    <h3 className="font-display text-2xl font-black tracking-tight mb-4 leading-snug group-hover:text-secondary transition-colors line-clamp-2">{cs.title}</h3>
                    <p className="font-body text-sm text-foreground/50 leading-relaxed mb-8 flex-1 line-clamp-3">{cs.description}</p>
                    
                    <div className="flex items-center justify-between border-t border-outline/10 pt-6">
                      <div className="flex items-center gap-2 font-display font-black text-[9px] uppercase tracking-widest text-secondary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 transform duration-300">
                        Explore <ArrowRight size={12} />
                      </div>
                      {cs.sections && (
                        <div className="font-display font-bold text-[8px] uppercase tracking-widest text-foreground/30">
                           {cs.sections.length} Sections
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Action Call */}
        <section className="px-6 md:px-16 max-w-4xl mx-auto mt-32 text-center">
          <div className="bg-surface-low rounded-[3rem] p-16 md:p-20 relative overflow-hidden border border-outline/10">
            <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none" />
            <p className="font-display text-secondary uppercase tracking-[0.4em] text-[10px] font-black mb-6 relative z-10">Architect For The Future</p>
            <h2 className="font-display text-4xl md:text-6xl font-black tracking-tighter mb-8 relative z-10 leading-tight">Does your system need this depth?</h2>
            <p className="font-body text-foreground/50 mb-12 text-lg max-w-xl mx-auto relative z-10 leading-relaxed">Let me bring this level of engineering rigor and architectural planning to your next project.</p>
            <BuildCTA text="Consult With Me" href="/contact" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
