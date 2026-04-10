import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import BuildCTA from "@/components/BuildCTA";

export const metadata: Metadata = {
  title: "Case Studies | Vinoth S – Digital Architect",
  description: "Deep dive technical case studies on scalable backend architecture, Redis, MongoDB, and full-stack product development.",
};

const CASE_STUDIES = [
  {
    id: "redis-scaling-srimaccafes",
    title: "Scaling to 10x Traffic with Redis",
    category: "Backend Architecture",
    readTime: "8 min read",
    summary: "How I used Redis caching to reduce MongoDB read load by 80% on Srimaccafes, cutting average API response time from 240ms to 12ms.",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=900&q=80",
  },
  {
    id: "end-to-end-encryption-patterns",
    title: "End-to-End Encryption Without a Key Server",
    category: "Security Engineering",
    readTime: "12 min read",
    summary: "A deep dive into implementing client-side AES-256-GCM encryption using PBKDF2 key derivation — with zero plaintext in the database.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=900&q=80",
  },
  {
    id: "razorpay-webhook-reliability",
    title: "Bulletproof Razorpay Webhooks",
    category: "Payment Systems",
    readTime: "6 min read",
    summary: "Building idempotent payment webhook handlers that survive network retries, race conditions, and duplicate delivery with MongoDB change streams.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&q=80",
  },
  {
    id: "next-js-performance-patterns",
    title: "Next.js Performance Patterns for E-commerce",
    category: "Frontend Architecture",
    readTime: "10 min read",
    summary: "Applying ISR, streaming SSR, and advanced image optimization in Next.js to achieve sub-1.2s LCP on a product catalog with 500+ SKUs.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80",
  },
];

export default function CaseStudiesPage() {
  const [featured, ...rest] = CASE_STUDIES;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28 pb-28">
        {/* Header */}
        <section className="px-6 md:px-16 max-w-7xl mx-auto mb-20 relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/8 blur-[120px] rounded-full -z-10" />
          <Link href="/" className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors mb-10">
            <ArrowLeft size={14} /> Back Home
          </Link>
          <p className="font-display text-secondary uppercase tracking-[0.35em] text-xs font-bold mb-5">Deep Dives</p>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Case Studies
          </h1>
          <p className="text-foreground/55 font-body text-lg max-w-xl">
            Technical deep-dives into the decisions, patterns, and tradeoffs behind real production systems.
          </p>
        </section>

        {/* Featured Case Study */}
        <section className="px-6 md:px-16 max-w-7xl mx-auto mb-16">
          <Link href={`/case-studies/${featured.id}`} className="group block">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-outline/10 group-hover:border-outline/30 transition-all">
              <div className="relative h-64 lg:h-auto">
                <Image src={featured.image} alt={featured.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-background/30 hidden lg:block" />
              </div>
              <div className="bg-surface-low p-10 md:p-14 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <span className="bg-secondary/10 text-secondary font-display font-bold text-[9px] uppercase tracking-widest px-3 py-1.5 rounded">
                    {featured.category}
                  </span>
                  <span className="flex items-center gap-1.5 font-display text-[9px] uppercase tracking-widest text-foreground/35 font-bold">
                    <Clock size={10} /> {featured.readTime}
                  </span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-black tracking-tighter mb-5 leading-tight">{featured.title}</h2>
                <p className="font-body text-foreground/65 leading-relaxed mb-8">{featured.summary}</p>
                <span className="inline-flex items-center gap-2 font-display font-bold text-[10px] uppercase tracking-widest text-primary group-hover:gap-4 transition-all">
                  Read Case Study <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        </section>

        {/* Other Case Studies */}
        <section className="px-6 md:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rest.map((cs) => (
              <Link key={cs.id} href={`/case-studies/${cs.id}`} className="group block">
                <GlassCard hoverEffect glowColor="secondary" className="h-full">
                  <div className="relative h-48 rounded-lg overflow-hidden mb-6 -mx-6 -mt-6">
                    <Image src={cs.image} alt={cs.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-low via-surface-low/40 to-transparent" />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-primary/10 text-primary font-display font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded">
                      {cs.category}
                    </span>
                    <span className="flex items-center gap-1 font-display text-[9px] uppercase tracking-widest text-foreground/35">
                      <Clock size={10} /> {cs.readTime}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-black tracking-tighter mb-3 leading-tight group-hover:text-primary transition-colors">{cs.title}</h3>
                  <p className="font-body text-sm text-foreground/55 leading-relaxed">{cs.summary}</p>
                  <div className="mt-6 flex items-center gap-2 font-display font-bold text-[9px] uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Read More <ArrowRight size={12} />
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-16 max-w-3xl mx-auto mt-28 text-center">
          <p className="font-display text-primary uppercase tracking-[0.3em] text-xs font-bold mb-6">Collaborate</p>
          <h2 className="font-display text-4xl md:text-5xl font-black tracking-tighter mb-6">Like what you see?</h2>
          <p className="font-body text-foreground/55 mb-10">Let me bring this depth of engineering to your next project.</p>
          <BuildCTA text="Build Project With Me" href="/contact" />
        </section>
      </main>
      <Footer />
    </div>
  );
}
