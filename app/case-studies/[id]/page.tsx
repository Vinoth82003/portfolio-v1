import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, BookOpen, Share2, Layers, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import BuildCTA from "@/components/BuildCTA";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

import { getCaseStudies, getCaseStudyById } from "@/lib/actions/case-studies";

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies(true);
  return caseStudies.map((cs: any) => ({ id: cs.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const cs = await getCaseStudyById(id, true);
  if (!cs) return { title: "Project Not Found" };
  return { title: `${cs.title} | Vinoth S`, description: cs.description };
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cs = await getCaseStudyById(id, true) as any;
  if (!cs) notFound();

  // Fetch all to find related
  const allStudies = await getCaseStudies(true);
  const related = cs.relatedIds ? cs.relatedIds.map((rid: string) => allStudies.find((c: any) => c.id === rid)).filter((c: any): c is NonNullable<any> => !!c) : [];

  return (
    <div className="min-h-screen bg-background selection:bg-secondary/30 selection:text-foreground">
      <Navbar />
      <main className="pt-20">
        {/* Editorial Hero */}
        <div className="relative h-[65vh] min-h-[500px] overflow-hidden flex flex-col justify-end">
          {cs.heroImage && (
            <div className="absolute inset-0 w-full h-full">
              <Image src={cs.heroImage} alt={cs.title} fill sizes="100vw" className="object-cover scale-105 animate-[slow-zoom_20s_ease-in-out_infinite_alternate]" priority />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background z-10" />
          {/* Subtle noise/texture overlay could go here */}
          
          <div className="relative z-20 px-6 md:px-16 pb-16 max-w-[1000px] mx-auto w-full text-center">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 mb-8">
              <span className="bg-secondary/10 text-secondary font-display font-black text-[10px] md:text-[11px] uppercase tracking-[0.3em] px-4 py-2 rounded-sm border border-secondary/20 backdrop-blur-md shadow-lg shadow-secondary/10">
                {cs.category}
              </span>
              <span className="flex items-center gap-2 font-display text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-foreground/50 font-bold bg-surface-low/50 px-4 py-2 rounded-sm border border-outline/10">
                <Clock size={12} className="text-secondary/70" /> {cs.readTime}
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter max-w-4xl mx-auto leading-[1.05] drop-shadow-xl mb-6 text-balance">
              {cs.title}
            </h1>
            <p className="font-body text-foreground/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-balance">
              {cs.description}
            </p>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-16 pb-32">
          {/* Navigation Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between py-6 border-b border-outline/10 -mt-6 relative z-30 bg-background/80 backdrop-blur-2xl rounded-2xl px-6 shadow-xl mb-16 gap-6">
            <Link href="/case-studies" className="group inline-flex items-center gap-3 font-display text-[10px] uppercase tracking-[0.2em] text-foreground/50 hover:text-secondary transition-colors font-bold">
              <div className="w-8 h-8 rounded-full bg-surface-high flex items-center justify-center border border-outline/10 group-hover:border-secondary/30 transition-all">
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              </div>
              Library
            </Link>
            <button className="group inline-flex items-center gap-3 font-display text-[10px] uppercase tracking-[0.2em] text-foreground/50 hover:text-secondary transition-colors font-bold">
              Share Case Study <span className="w-8 h-8 rounded-full bg-surface-high flex items-center justify-center border border-outline/10 group-hover:border-secondary/30 transition-all"><Share2 size={12} /></span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Article */}
            <article className="lg:col-span-8">
              
              {/* Featured Image */}
              {cs.image && (
                <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-outline/10 mb-16 shadow-2xl group">
                  <Image src={cs.image} alt={cs.title} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover group-hover:scale-105 transition-transform duration-1000" priority />
                  <div className="absolute inset-0 bg-gradient-to-tr from-secondary/10 to-transparent mix-blend-screen pointer-events-none" />
                </div>
              )}

              {/* Dynamic Sections sequence */}
              <div className="space-y-24">
                {cs.sections && cs.sections.map((sec: any, idx: number) => (
                  <section key={idx} className="relative scroll-m-20" id={`section-${idx}`}>
                    <div className="flex items-center gap-4 mb-8">
                       <span className="font-display font-black text-6xl text-secondary/10 -ml-16 hidden md:block select-none pointer-events-none">
                         0{idx+1}
                       </span>
                       <h2 className="font-display text-3xl md:text-4xl font-black tracking-tighter text-foreground/90">{sec.heading}</h2>
                    </div>
                    
                    <div className="max-w-none">
                      <MarkdownRenderer content={sec.content} />
                    </div>

                    {sec.code && (
                      <div className="mt-8 relative group">
                        <div className="absolute inset-0 bg-secondary/5 blur-xl -z-10 group-hover:bg-secondary/10 transition-colors duration-500 rounded-3xl" />
                        <div className="bg-[#0A0D14] border border-outline/10 rounded-2xl overflow-hidden shadow-2xl">
                          <div className="bg-[#111520] border-b border-outline/10 px-6 py-3 flex items-center justify-between">
                             <div className="flex gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-error/80" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                             </div>
                             <span className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest">Implementation</span>
                          </div>
                          <div className="p-6 overflow-x-auto custom-scrollbar">
                            <pre className="font-mono text-sm leading-relaxed text-[#c9d1d9]"><code dangerouslySetInnerHTML={{ __html: sec.code.replace(/</g, "&lt;").replace(/>/g, "&gt;") }} /></pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>
                ))}

                {/* Outcomes */}
                {cs.outcome && cs.outcome.length > 0 && (
                  <section className="bg-surface-low border border-outline/10 rounded-[2rem] p-10 md:p-14 relative overflow-hidden mt-16 shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[100px] pointer-events-none mix-blend-screen" />
                    <div className="flex items-center gap-4 mb-10 relative z-10">
                       <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                          <Layers size={22} />
                       </div>
                       <h2 className="font-display text-3xl font-black tracking-tighter">Verified Outcomes</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                      {cs.outcome.map((item: string, i: number) => (
                        <div key={i} className="flex gap-4 items-start bg-surface-high/50 p-6 rounded-2xl border border-outline/5 hover:border-secondary/30 transition-colors">
                          <CheckCircle2 size={24} className="text-secondary flex-shrink-0 mt-0.5" />
                          <p className="font-body text-foreground/80 leading-relaxed font-medium">{item}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </article>

            {/* Sidebar Details */}
            <aside className="lg:col-span-4 relative mt-16 lg:mt-0">
              <div className="lg:sticky lg:top-28 space-y-8">
                
                {/* Table of Contents - Optional, but we'll show Author Details */}
                <GlassCard hoverEffect glowColor="secondary" className="p-8 border-secondary/10">
                  <p className="font-display text-[10px] uppercase tracking-[0.3em] text-foreground/40 font-black mb-6 flex items-center gap-2">
                     <BookOpen size={14} className="text-secondary opacity-70" /> Architect Info
                  </p>
                  <p className="font-display text-xl font-black mb-2">Vinoth S</p>
                  <p className="font-body text-sm text-foreground/60 leading-relaxed mb-6">Full Stack Developer & Digital Architect specializing in scalable systems and premium user experiences.</p>
                  <BuildCTA text="Collaborate" href="/contact" className="w-full text-center" />
                </GlassCard>

                {/* Related Reads */}
                {related.length > 0 && (
                  <GlassCard hoverEffect={false} className="p-8">
                    <p className="font-display text-[10px] uppercase tracking-[0.3em] text-foreground/40 font-black mb-6">Related Deep Dives</p>
                    <div className="space-y-6">
                      {related.map((r: any) => (
                        <Link key={r.id} href={`/case-studies/${r.id}`} className="flex flex-col gap-3 group">
                          <div className="relative w-full h-32 rounded-xl overflow-hidden border border-outline/10">
                            <Image src={r.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f"} alt={r.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                            <div className="absolute bottom-3 left-4 right-4">
                               <p className="font-display font-black text-sm leading-tight text-white group-hover:text-secondary transition-colors line-clamp-2">{r.title}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </GlassCard>
                )}
                
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.05); }
        }
      `}} />
    </div>
  );
}
