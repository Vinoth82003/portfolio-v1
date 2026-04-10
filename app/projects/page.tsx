import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BuildCTA from "@/components/BuildCTA";

export const metadata: Metadata = {
  title: "Projects | Vinoth S – Digital Architect",
  description: "Explore the full portfolio of projects built by Vinoth S – full stack web applications with modern architecture.",
};

// Static project data (seeded from Stitch content)
const PROJECTS = [
  {
    id: "srimaccafes",
    title: "Srimaccafes",
    type: "Full-Stack E-commerce",
    year: "2024",
    desc: "Modern e-commerce platform for a specialty coffee brand, featuring Razorpay payment integration, Redis caching for performance, and a complete admin panel for content management.",
    tech: ["Next.js", "Node.js", "MongoDB", "Redis", "Razorpay", "Cloudinary"],
    link: "https://www.srimaccafes.in/",
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&q=80",
  },
  {
    id: "my-data-manager",
    title: "My Data Manager",
    type: "Secure Data System",
    year: "2024",
    desc: "Centralized and encrypted personal data management platform. Allows users to securely store credentials, notes, and files with end-to-end encryption and a CLI-based project management interface.",
    tech: ["Next.js", "Node.js", "MongoDB", "Crypto", "TypeScript"],
    link: "https://mydata-xi.vercel.app/",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
  },
  {
    id: "share-me",
    title: "Share Me",
    type: "Instant Sharing",
    year: "2023",
    desc: "Minimal, no-signup platform for encrypted file and text sharing using 4-digit codes. Built for speed and privacy — content auto-expires after retrieval.",
    tech: ["Next.js", "Node.js", "MongoDB"],
    link: "https://shareall.vercel.app/",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
  },
  {
    id: "redis-cache-api",
    title: "Redis Cache API",
    type: "Backend Infrastructure",
    year: "2024",
    desc: "High-performance caching layer built on Redis, dramatically reducing database read times and enabling scalable API responses for high-traffic scenarios.",
    tech: ["Node.js", "Redis", "Express", "TypeScript"],
    link: "https://github.com/Vinoth82003",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80",
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28 pb-20">
        {/* Header */}
        <section className="px-6 md:px-16 max-w-7xl mx-auto mb-20 relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/8 blur-[120px] rounded-full -z-10" />
          <Link href="/" className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors mb-10">
            <ArrowLeft size={14} /> Back Home
          </Link>
          <p className="font-display text-primary uppercase tracking-[0.35em] text-xs font-bold mb-5">Portfolio</p>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Architectural <br />
            <span className="text-foreground/25">Works</span>
          </h1>
          <p className="text-foreground/55 font-body text-lg max-w-xl">
            A collection of full-stack applications built with intentional design, scalable infrastructure, and editorial attention to detail.
          </p>
        </section>

        {/* Project Grid */}
        <section className="px-6 md:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {PROJECTS.map((proj) => (
              <Link key={proj.id} href={`/projects/${proj.id}`} className="group block">
                <div className="relative h-[360px] rounded-2xl overflow-hidden border border-outline/10 group-hover:border-outline/30 transition-all duration-300 mb-6">
                  <Image
                    src={proj.image}
                    alt={proj.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-secondary/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Hover CTA */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-gradient-to-r from-primary via-primary-dim to-secondary text-surface-lowest font-display font-bold text-[10px] uppercase tracking-widest px-6 py-3 rounded-md flex items-center gap-2 shadow-xl">
                      Explore Project <ArrowRight size={13} />
                    </span>
                  </div>

                  <div className="absolute bottom-7 left-7 right-7">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[9px] uppercase tracking-widest text-foreground/50 font-bold">{proj.type}</p>
                      <p className="text-[9px] uppercase tracking-widest text-foreground/30 font-bold">{proj.year}</p>
                    </div>
                    <h2 className="font-display text-2xl font-black tracking-tight mb-3">{proj.title}</h2>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.tech.slice(0, 4).map((t) => (
                        <span key={t} className="text-[9px] uppercase tracking-wider bg-background/80 backdrop-blur px-2 py-1 rounded font-display font-semibold">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-foreground/55 leading-relaxed font-body text-sm">{proj.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Strip */}
        <section className="px-6 md:px-16 max-w-7xl mx-auto mt-24">
          <div className="bg-surface-low rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center gap-8 justify-between border border-outline/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-0" />
            <div className="relative z-10">
              <p className="font-display text-primary uppercase tracking-[0.3em] text-xs font-bold mb-4">Work Together</p>
              <h3 className="font-display text-3xl md:text-4xl font-black tracking-tighter">Have a project in mind?</h3>
            </div>
            <div className="relative z-10 flex gap-4 shrink-0">
              <BuildCTA text="Build Project" href="/contact" />
              <a href="https://github.com/Vinoth82003" target="_blank" rel="noreferrer"
                className="border border-outline/30 px-6 py-4 rounded-md font-display font-bold uppercase tracking-widest text-xs hover:bg-surface-high transition-all flex items-center gap-2">
                GitHub <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
