import { CaseStudies } from "../interfaces/case-studies";

export const CASE_STUDIES: CaseStudies = [
  {
    id: "redis-scaling-srimaccafes",
    title: "Scaling to 10x Traffic with Redis",
    category: "Backend Architecture",
    readTime: "8 min read",
    description: "How I used Redis caching to reduce MongoDB read load by 80% on Srimaccafes, cutting average API response time from 240ms to 12ms.",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=900&q=80",
    heroImage: "https://images.unsplash.com/photo-1520500807606-4ac9ae633574?w=1600&q=80",
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
    ],
    outcome: [
      "API response time dropped from 240ms → 12ms (95th percentile)",
      "MongoDB read operations reduced by 80% during peak hours",
      "System successfully handled a 10x traffic surge during a promotional campaign",
      "Zero stale cache incidents in production since launch",
    ],
    relatedIds: ["next-js-performance-patterns", "razorpay-webhook-reliability"],
  },
  {
    id: "end-to-end-encryption-patterns",
    title: "End-to-End Encryption Without a Key Server",
    category: "Security Engineering",
    readTime: "12 min read",
    description: "A deep dive into implementing client-side AES-256-GCM encryption using PBKDF2 key derivation — with zero plaintext in the database.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=900&q=80",
    heroImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1600&q=80",
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
    ],
    outcome: [
      "Zero plaintext data in the database — verified via direct DB inspection",
      "Successfully resists offline dictionary attacks due to PBKDF2 iteration count",
      "Full data recovery possible only with the correct master password",
      "Passed a security review as part of a university research project",
    ],
    relatedIds: ["redis-scaling-srimaccafes", "razorpay-webhook-reliability"],
  },
  {
    id: "razorpay-webhook-reliability",
    title: "Bulletproof Razorpay Webhooks",
    category: "Payment Systems",
    readTime: "6 min read",
    description: "Building idempotent payment webhook handlers that survive network retries, race conditions, and duplicate delivery with MongoDB change streams.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&q=80",
    heroImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=80",
    sections: [
      {
        heading: "The Problem with Webhooks",
        content: "Razorpay, like all payment providers, guarantees 'at-least-once' delivery for webhooks. This means the same `payment.captured` event can arrive multiple times. Without proper handling, this leads to duplicate order fulfillment — a critical business bug.",
      },
      {
        heading: "Idempotency via MongoDB",
        content: "The solution was to use the Razorpay payment ID as an idempotency key. Before processing any webhook, the handler checks MongoDB for an existing order with that payment ID.",
        code: `// Idempotent handler
const existing = await Order.findOne({ razorpayPaymentId: paymentId });
if (existing) {
  return res.status(200).json({ status: 'already_processed' });
}`,
      },
    ],
    outcome: [
      "Zero duplicate orders in production across 1,500+ webhook events",
      "All webhook events processed within 500ms average",
      "Webhook handler handles bursts of 50 concurrent retries gracefully",
    ],
    relatedIds: ["redis-scaling-srimaccafes", "next-js-performance-patterns"],
  },
  {
    id: "next-js-performance-patterns",
    title: "Next.js Performance Patterns for E-commerce",
    category: "Frontend Architecture",
    readTime: "10 min read",
    description: "Applying ISR, streaming SSR, and advanced image optimization in Next.js to achieve sub-1.2s LCP on a product catalog with 500+ SKUs.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80",
    heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80",
    sections: [
      {
        heading: "The Goal",
        content: "Srimaccafes needed a storefront that felt instant, even on 3G connections in Tamil Nadu. The benchmark was a Largest Contentful Paint (LCP) under 1.2 seconds for the product listing page.",
      },
      {
        heading: "Incremental Static Regeneration (ISR)",
        content: "Product listing pages are pre-rendered at build time and served as static HTML from the CDN edge. ISR with a 60-second revalidation window ensures prices and stock levels stay fresh without sacrificing speed.",
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
];
