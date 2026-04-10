import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import BuildCTA from "@/components/BuildCTA";

const PROJECTS: Record<string, ProjectDetail> = {
  srimaccafes: {
    id: "srimaccafes",
    title: "Srimaccafes",
    type: "Full-Stack E-commerce",
    year: "2024",
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1400&q=80",
    heroImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&q=80",
    link: "https://www.srimaccafes.in/",
    github: "https://github.com/Vinoth82003",
    tech: ["Next.js", "Node.js", "MongoDB", "Redis", "Razorpay", "Cloudinary", "Tailwind CSS", "TypeScript"],
    overview: "Srimaccafes is a modern, production-ready e-commerce platform built for a specialty coffee brand. The project demanded a complete solution: a storefront, a payment gateway, an inventory management system, and a content delivery pipeline.",
    challenge: "The primary challenge was building a system that could handle high read traffic on the product catalog without overwhelming the MongoDB database. Additionally, a seamless, mobile-first checkout experience was required with reliable payment webhook handling.",
    solution: "Implemented a Redis caching strategy for product data, reducing database reads by 80%. Built a robust Razorpay integration with idempotent webhook processing. Used Cloudinary for optimized image delivery and Next.js for server-side rendering to maximize SEO and initial page load performance.",
    outcome: "Launched successfully to 100+ users with zero production incidents. Page load time under 1.2s on mobile. Admin panel allows non-technical staff to manage products, orders, and content independently.",
    gallery: [
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    ],
  },
  "my-data-manager": {
    id: "my-data-manager",
    title: "My Data Manager",
    type: "Secure Data System",
    year: "2024",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&q=80",
    heroImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1400&q=80",
    link: "https://mydata-xi.vercel.app/",
    github: "https://github.com/Vinoth82003",
    tech: ["Next.js", "Node.js", "MongoDB", "Crypto", "TypeScript", "Zod"],
    overview: "A centralized, encrypted personal data management application. Users can securely store credentials, notes, and sensitive files with end-to-end encryption. Built with a CLI-based internal tooling system for developer productivity.",
    challenge: "Ensuring data security without a centralized key management service. The application needed to be completely self-hosted and ensure that even the database administrator could not read user data.",
    solution: "Used the native Node.js Crypto module with AES-256-GCM encryption. Each user has a unique salt derived from their password using PBKDF2. The encryption key is never stored — it is derived at runtime. All data is encrypted client-side before being sent to the server.",
    outcome: "Fully functional secure vault. Zero plaintext data in the database. The system supports multiple data categories and provides an intuitive UI for fast retrieval of stored information.",
    gallery: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    ],
  },
  "share-me": {
    id: "share-me",
    title: "Share Me",
    type: "Instant Sharing",
    year: "2023",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&q=80",
    heroImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400&q=80",
    link: "https://shareall.vercel.app/",
    github: "https://github.com/Vinoth82003",
    tech: ["Next.js", "Node.js", "MongoDB", "Tailwind CSS"],
    overview: "A minimal, no-signup platform for instant encrypted file and text sharing. Content is shared using a 4-digit code and auto-expires after the first retrieval, making it perfect for quick, private transfers.",
    challenge: "Building a system that feels instant and frictionless while ensuring content is truly ephemeral. The challenge was handling file uploads efficiently without a dedicated storage service.",
    solution: "Files are converted to Base64 and stored temporarily in MongoDB with a TTL index. Upon retrieval using the 4-digit code, the document is immediately deleted. The entire flow — upload to share — takes under 3 seconds.",
    outcome: "Used by 50+ users for quick file sharing. 100% content deletion after first access verified through automated testing. Average upload time under 2 seconds for files up to 10MB.",
    gallery: [
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80",
    ],
  },
  "redis-cache-api": {
    id: "redis-cache-api",
    title: "Redis Cache API",
    type: "Backend Infrastructure",
    year: "2024",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1400&q=80",
    heroImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&q=80",
    link: "https://github.com/Vinoth82003",
    github: "https://github.com/Vinoth82003",
    tech: ["Node.js", "Redis", "Express", "TypeScript", "Docker"],
    overview: "A reusable, production-ready caching middleware layer built on Redis. Designed to be dropped into any Express.js API to dramatically reduce database read latency and improve throughput under high traffic.",
    challenge: "Most caching implementations are tightly coupled to specific business logic. The goal was to create a generic, configurable middleware that could handle cache invalidation, conditional caching, and TTL management declaratively.",
    solution: "Built a configurable Express middleware factory that accepts a cache key generator function and TTL options. Cache invalidation is handled via Redis keyspace notifications. The middleware supports both JSON and binary response caching.",
    outcome: "Reduced average API response time from 240ms to 12ms for cached routes. Now used as a core utility in the Srimaccafes project.",
    gallery: [
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80",
    ],
  },
};

interface ProjectDetail {
  id: string; title: string; type: string; year: string; image: string; heroImage: string;
  link: string; github: string; tech: string[]; overview: string; challenge: string;
  solution: string; outcome: string; gallery: string[];
}

export async function generateStaticParams() {
  return Object.keys(PROJECTS).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const proj = PROJECTS[id];
  if (!proj) return { title: "Project Not Found" };
  return { title: `${proj.title} | Vinoth S`, description: proj.overview };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const proj = PROJECTS[id];
  if (!proj) notFound();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <div className="relative h-[60vh] overflow-hidden">
          <Image src={proj.heroImage} alt={proj.title} fill className="object-cover" priority />
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
              <a href={proj.github} target="_blank" rel="noreferrer"
                className="border border-outline/20 px-4 py-2.5 rounded-md font-display font-bold text-[10px] uppercase tracking-widest hover:bg-surface-high transition-all flex items-center gap-2">
                <Github size={14} /> Code
              </a>
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
              {proj.gallery.length > 0 && (
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
