import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import BuildCTA from "@/components/BuildCTA";

import { PROJECTS } from "@/app/data/projects";

export async function generateStaticParams() {
  return PROJECTS.map((proj) => ({ id: proj.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const proj = PROJECTS.find(p => p.id === id);
  if (!proj) return { title: "Project Not Found" };
  return { title: `${proj.title} | Vinoth S`, description: proj.overview };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const proj = PROJECTS.find(p => p.id === id);
  if (!proj) notFound();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <div className="relative h-[60vh] overflow-hidden">
          {proj.heroImage && <Image src={proj.heroImage} alt={proj.title} fill className="object-cover" priority />}
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/20 to-background" />
          <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-16 pb-16 max-w-7xl mx-auto">
            <p className="font-display text-primary uppercase tracking-[0.35em] text-xs font-bold mb-4">{proj.type} · {proj.year}</p>
            <h1 className="font-display text-5xl md:text-8xl font-black tracking-tighter mb-6">{proj.title}</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-16 pb-28">
          {/* Back link + Actions */}
          <div className="flex items-center justify-between py-10 border-b border-outline/10">
            <Link href="/projects" className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors">
              <ArrowLeft size={14} /> All Projects
            </Link>
            <div className="flex gap-3">
              {proj.github && (
                <a href={proj.github} target="_blank" rel="noreferrer"
                  className="border border-outline/20 px-4 py-2.5 rounded-md font-display font-bold text-[10px] uppercase tracking-widest hover:bg-surface-high transition-all flex items-center gap-2">
                  <Github size={14} /> Code
                </a>
              )}
              <a href={proj.link} target="_blank" rel="noreferrer"
                className="bg-primary text-surface-lowest px-4 py-2.5 rounded-md font-display font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2">
                <ExternalLink size={14} /> Live Site
              </a>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 pt-16">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-16">
              <div>
                <p className="font-display text-[10px] uppercase tracking-[0.3em] text-foreground/35 font-bold mb-5">Overview</p>
                <p className="font-body text-lg text-foreground/75 leading-relaxed">{proj.overview}</p>
              </div>
              <div>
                <p className="font-display text-[10px] uppercase tracking-[0.3em] text-foreground/35 font-bold mb-5">The Challenge</p>
                <p className="font-body text-lg text-foreground/75 leading-relaxed">{proj.challenge}</p>
              </div>
              <div>
                <p className="font-display text-[10px] uppercase tracking-[0.3em] text-foreground/35 font-bold mb-5">The Solution</p>
                <p className="font-body text-lg text-foreground/75 leading-relaxed">{proj.solution}</p>
              </div>
              <GlassCard className="border-secondary/20">
                <p className="font-display text-[10px] uppercase tracking-[0.3em] text-secondary font-bold mb-5">Outcome</p>
                <p className="font-body text-lg text-foreground/75 leading-relaxed">{proj.outcome}</p>
              </GlassCard>

              {/* Gallery */}
              {proj.gallery && proj.gallery.length > 0 && (
                <div>
                  <p className="font-display text-[10px] uppercase tracking-[0.3em] text-foreground/35 font-bold mb-6">Gallery</p>
                  <div className="grid grid-cols-2 gap-4">
                    {proj.gallery.map((img, i) => (
                      <div key={i} className={`relative rounded-xl overflow-hidden border border-outline/10 ${i === 0 ? "col-span-2 h-64" : "h-48"}`}>
                        <Image src={img} alt={`${proj.title} screenshot ${i + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              <GlassCard>
                <p className="font-display text-[10px] uppercase tracking-[0.3em] text-foreground/35 font-bold mb-6">Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {proj.tech.map((t) => (
                    <span key={t} className="bg-background text-foreground/70 text-[9px] font-display font-bold uppercase tracking-wider px-3 py-1.5 rounded border border-outline/10">
                      {t}
                    </span>
                  ))}
                </div>
              </GlassCard>
              <GlassCard>
                <p className="font-display text-[10px] uppercase tracking-[0.3em] text-foreground/35 font-bold mb-6">Have a similar idea?</p>
                <p className="font-body text-sm text-foreground/55 mb-6 leading-relaxed">Let's architect your next digital product together.</p>
                <BuildCTA text="Build Project" href="/contact" className="w-full text-center" />
              </GlassCard>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
