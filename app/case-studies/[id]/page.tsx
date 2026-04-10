import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import BuildCTA from "@/components/BuildCTA";

interface CaseStudyDetail {
  id: string; title: string; category: string; readTime: string;
  image: string; heroImage: string; summary: string;
  sections: { heading: string; content: string; code?: string }[];
  outcome: string[];
  relatedIds: string[];
}

const CASE_STUDIES: Record<string, CaseStudyDetail> = {
  "redis-scaling-srimaccafes": {
    id: "redis-scaling-srimaccafes",
    title: "Scaling to 10x Traffic with Redis",
    category: "Backend Architecture",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80",
    heroImage: "https://images.unsplash.com/photo-1520500807606-4ac9ae633574?w=1600&q=80",
    summary: "How I used Redis caching to reduce MongoDB read load by 80% on Srimaccafes, cutting average API response time from 240ms to 12ms.",
    sections: [
      {
        heading: "The Problem",
        content: "Srimaccafes was experiencing growing read load on the product catalog API. During peak hours, each product listing request would trigger 3-5 MongoDB queries — one for the product, one for the category, one for the inventory count. At 200 concurrent users, this resulted in an average response time of 240ms and noticeable UI jank on the storefront.",
      },
      {
        heading: "Why Redis?",
        content: "The product catalog is read-heavy and update-sparse. Products are updated by an admin at most a few times per day, but they are read by hundreds of customers continuously. This is the textbook use case for a read-through cache. Redis was chosen for its sub-millisecond latency, built-in TTL support for automatic cache expiry, and its first-class support in Node.js via the `ioredis` client.",
      },
      {
        heading: "The Caching Strategy",
        content: "We implemented a Cache-Aside (Lazy Loading) pattern. On a cache miss, the API queries MongoDB, stores the result in Redis with a 5-minute TTL, and returns the data. On subsequent requests within the TTL, the data is served directly from Redis. For the admin panel's write operations, a Cache Write-Through pattern was used — updating MongoDB and the Redis cache simultaneously to prevent stale reads.",
        code: `// Cache-Aside Pattern
async function getProduct(id: string) {
  const cacheKey = \`product:\${id}\`;
  const cached = await redis.get(cacheKey);

  if (cached) return JSON.parse(cached); // Cache hit

  // Cache miss – fetch from DB
  const product = await Product.findById(id).lean();
  if (product) {
    await redis.set(cacheKey, JSON.stringify(product), 'EX', 300);
  }
  return product;
}`,
      },
      {
        heading: "Cache Invalidation",
        content: "Cache invalidation is famously hard. The strategy here was simple by design: when any product document is updated by the admin, the corresponding Redis key is deleted immediately. This triggers a cache miss on the next request, which re-populates the cache with fresh data. This 'delete-on-write' pattern is simpler and safer than trying to update the cache in-place.",
      },
    ],
    outcome: [
      "API response time dropped from 240ms → 12ms (95th percentile)",
      "MongoDB read operations reduced by 80% during peak hours",
      "System successfully handled a 10x traffic surge during a promotional campaign",
      "Zero stale cache incidents in production since launch",
    ],
    relatedIds: ["next-js-performance-patterns", "razorpay-webhook-reliability"],
  },
  "end-to-end-encryption-patterns": {
    id: "end-to-end-encryption-patterns",
    title: "End-to-End Encryption Without a Key Server",
    category: "Security Engineering",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80",
    heroImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1600&q=80",
    summary: "Implementing client-side AES-256-GCM encryption with PBKDF2 key derivation — with zero plaintext in the database.",
    sections: [
      {
        heading: "The Constraint",
        content: "My Data Manager needed to store sensitive user data (passwords, API keys, notes) with an ironclad guarantee: even if the database is compromised, the data is unreadable. The constraint was no external key management service — the solution had to be self-contained.",
      },
      {
        heading: "Key Derivation with PBKDF2",
        content: "The user's master password is never stored. Instead, PBKDF2 (Password-Based Key Derivation Function 2) with 200,000 iterations is used to derive a 256-bit encryption key from the password + a per-user random salt. The salt is stored in the database; the derived key never is.",
        code: `const key = crypto.pbkdf2Sync(
  password,
  Buffer.from(salt, 'hex'),
  200000,   // iterations
  32,       // keylen (256-bit)
  'sha256'
);`,
      },
      {
        heading: "Encryption with AES-256-GCM",
        content: "AES-256-GCM was chosen because it's an authenticated encryption scheme — it provides both confidentiality (no one can read the data) and integrity (any tampering is detected). Each encryption operation generates a random 12-byte IV, ensuring that the same plaintext encrypted twice produces different ciphertext.",
      },
    ],
    outcome: [
      "Zero plaintext data in the database — verified via direct DB inspection",
      "Successfully resists offline dictionary attacks due to PBKDF2 iteration count",
      "Full data recovery possible only with the correct master password",
      "Passed a security review as part of a university research project",
    ],
    relatedIds: ["redis-scaling-srimaccafes", "razorpay-webhook-reliability"],
  },
  "razorpay-webhook-reliability": {
    id: "razorpay-webhook-reliability",
    title: "Bulletproof Razorpay Webhooks",
    category: "Payment Systems",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80",
    heroImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=80",
    summary: "Building idempotent payment webhook handlers that survive network retries, race conditions, and duplicate delivery.",
    sections: [
      {
        heading: "The Problem with Webhooks",
        content: "Razorpay, like all payment providers, guarantees 'at-least-once' delivery for webhooks. This means the same `payment.captured` event can arrive multiple times. Without proper handling, this leads to duplicate order fulfillment — a critical business bug.",
      },
      {
        heading: "Idempotency via MongoDB",
        content: "The solution was to use the Razorpay payment ID as an idempotency key. Before processing any webhook, the handler checks MongoDB for an existing order with that payment ID. If one exists, the webhook is acknowledged (returning 200 OK) without reprocessing.",
        code: `// Idempotent handler
const existing = await Order.findOne({ razorpayPaymentId: paymentId });
if (existing) {
  return res.status(200).json({ status: 'already_processed' });
}
// ...process order and mark payment as captured`,
      },
      {
        heading: "Signature Verification",
        content: "Every incoming webhook is verified using Razorpay's HMAC-SHA256 signature before any processing. This prevents malicious actors from triggering fake payment events.",
      },
    ],
    outcome: [
      "Zero duplicate orders in production across 1,500+ webhook events",
      "All webhook events processed within 500ms average",
      "Webhook handler handles bursts of 50 concurrent retries gracefully",
    ],
    relatedIds: ["redis-scaling-srimaccafes", "next-js-performance-patterns"],
  },
  "next-js-performance-patterns": {
    id: "next-js-performance-patterns",
    title: "Next.js Performance Patterns for E-commerce",
    category: "Frontend Architecture",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80",
    summary: "Applying ISR, streaming SSR, and image optimization in Next.js to achieve sub-1.2s LCP on a product catalog with 500+ SKUs.",
    sections: [
      {
        heading: "The Goal",
        content: "Srimaccafes needed a storefront that felt instant, even on 3G connections in Tamil Nadu. The benchmark was a Largest Contentful Paint (LCP) under 1.2 seconds for the product listing page.",
      },
      {
        heading: "Incremental Static Regeneration (ISR)",
        content: "Product listing pages are pre-rendered at build time and served as static HTML from the CDN edge. ISR with a 60-second revalidation window ensures prices and stock levels stay fresh without sacrificing the speed of a static page.",
      },
      {
        heading: "Cloudinary Image Pipeline",
        content: "All product images are stored and transformed by Cloudinary. The Next.js Image component automatically serves WebP/AVIF formats, applies blur-up placeholders, and uses responsive sizing. This alone reduced image payload by 65% compared to unoptimized JPEG uploads.",
      },
    ],
    outcome: [
      "LCP of 1.1s on mobile (4G) — measured via Lighthouse",
      "Time to First Byte (TTFB) under 50ms via edge CDN",
      "65% reduction in image payload vs. unoptimized uploads",
      "Lighthouse Performance score of 96/100",
    ],
    relatedIds: ["redis-scaling-srimaccafes", "razorpay-webhook-reliability"],
  },
};

const ALL_FOR_SIDEBAR = Object.values(CASE_STUDIES);

export async function generateStaticParams() {
  return Object.keys(CASE_STUDIES).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const cs = CASE_STUDIES[id];
  if (!cs) return { title: "Case Study Not Found" };
  return { title: `${cs.title} | Vinoth S`, description: cs.summary };
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cs = CASE_STUDIES[id];
  if (!cs) notFound();
  const related = cs.relatedIds.map((rid) => CASE_STUDIES[rid]).filter(Boolean);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <div className="relative h-[55vh] overflow-hidden">
          <Image src={cs.heroImage} alt={cs.title} fill className="object-cover" priority />
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
                <p className="font-body text-lg text-foreground/75 leading-relaxed">{cs.summary}</p>
              </GlassCard>

              {cs.sections.map((sec) => (
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
