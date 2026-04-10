import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import BuildCTA from "@/components/BuildCTA";
import { CASE_STUDIES } from "@/app/data/case-studies";

export async function generateStaticParams() {
  return CASE_STUDIES.map((cs) => ({ id: cs.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const cs = CASE_STUDIES.find(c => c.id === id);
  if (!cs) return { title: "Project Not Found" };
  return { title: `${cs.title} | Vinoth S`, description: cs.description };
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cs = CASE_STUDIES.find(c => c.id === id);
  if (!cs) notFound();
  const related = cs.relatedIds ? cs.relatedIds.map((rid) => CASE_STUDIES.find(c => c.id === rid)).filter((c): c is NonNullable<typeof c> => !!c) : [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <div className="relative h-[55vh] overflow-hidden">
          {cs.heroImage && <Image src={cs.heroImage} alt={cs.title} fill className="object-cover" priority />}
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background" />
          <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-16 pb-16 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-5">
              <span className="bg-secondary/15 text-secondary font-display font-bold text-[9px] uppercase tracking-widest px-3 py-1.5 rounded backdrop-blur-sm">
                {cs.category}
              </span>
              <span className="flex items-center gap-1.5 font-display text-[9px] uppercase tracking-widest text-foreground/45 font-bold">
                <Clock size={10} /> {cs.readTime}
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-7xl font-black tracking-tighter max-w-4xl">{cs.title}</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-16 pb-28">
          <div className="flex items-center py-10 border-b border-outline/10">
            <Link href="/case-studies" className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors">
              <ArrowLeft size={14} /> All Case Studies
            </Link>
          </div>

          {/* Main Content + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 pt-14">
            {/* Article */}
            <article className="lg:col-span-2 space-y-14">
              {/* TL;DR */}
              <GlassCard className="border-secondary/20">
                <p className="font-display text-[10px] uppercase tracking-[0.3em] text-secondary font-bold mb-4">TL;DR</p>
                <p className="font-body text-lg text-foreground/75 leading-relaxed">{cs.description}</p>
              </GlassCard>

              {cs.sections && cs.sections.map((sec) => (
                <div key={sec.heading}>
                  <h2 className="font-display text-2xl font-black tracking-tighter mb-5">{sec.heading}</h2>
                  <p className="font-body text-foreground/70 leading-relaxed text-[1.0625rem] mb-6">{sec.content}</p>
                  {sec.code && (
                    <div className="bg-surface-lowest rounded-xl p-6 border border-outline/10 overflow-x-auto">
                      <pre className="font-mono text-sm text-secondary leading-relaxed"><code>{sec.code}</code></pre>
                    </div>
                  )}
                </div>
              ))}

              {/* Outcomes */}
              {cs.outcome && cs.outcome.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-black tracking-tighter mb-8">Results & Outcomes</h2>
                  <div className="space-y-4">
                    {cs.outcome.map((item, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary/15 rounded-full flex items-center justify-center text-primary font-display font-black text-[10px] mt-0.5">
                          {i + 1}
                        </span>
                        <p className="font-body text-foreground/70">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="space-y-8">
              <GlassCard>
                <p className="font-display text-[10px] uppercase tracking-[0.3em] text-foreground/35 font-bold mb-6">Build Something Similar?</p>
                <p className="font-body text-sm text-foreground/55 mb-6 leading-relaxed">I'd love to bring this depth of engineering to your project.</p>
                <BuildCTA text="Build Project" href="/contact" className="w-full text-center" />
              </GlassCard>

              {related.length > 0 && (
                <GlassCard>
                  <p className="font-display text-[10px] uppercase tracking-[0.3em] text-foreground/35 font-bold mb-6">Related Case Studies</p>
                  <div className="space-y-5">
                    {related.map((r) => (
                      <Link key={r.id} href={`/case-studies/${r.id}`} className="flex items-start gap-3 group">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-outline/10 flex-shrink-0">
                          <Image src={r.image} alt={r.title} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-display font-bold text-sm leading-tight group-hover:text-primary transition-colors">{r.title}</p>
                          <p className="font-display text-[9px] uppercase tracking-widest text-foreground/35 mt-1">{r.category}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </GlassCard>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
