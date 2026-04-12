import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Clock, CalendarDays } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import BuildCTA from "@/components/BuildCTA";

export const metadata: Metadata = {
  title: "Blogs | Vinoth S – Digital Architect",
  description: "Technical writings, thoughts, and tutorials on full-stack architecture, AI engineering, and software development.",
};

export const dynamic = "force-dynamic";

import { getBlogs } from "@/lib/actions/blogs";

export default async function BlogsPage() {
  const blogs = await getBlogs() as any[];
  
  if (blogs.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-28 pb-28 text-center">
          <p className="font-display text-xs uppercase tracking-widest text-foreground/40 mb-4">No blogs found</p>
          <Link href="/" className="text-primary font-display font-bold text-xs uppercase tracking-widest">Return Home</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const [featured, ...rest] = blogs;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28 pb-28">
        {/* Header */}
        <section className="px-6 md:px-16 max-w-7xl mx-auto mb-20 relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/8 blur-[120px] rounded-full -z-10" />
          <Link href="/" className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors mb-10">
            <ArrowLeft size={14} /> Back Home
          </Link>
          <p className="font-display text-primary uppercase tracking-[0.35em] text-xs font-bold mb-5">Journal</p>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Tech Blogs
          </h1>
          <p className="text-foreground/55 font-body text-lg max-w-xl">
            Thoughts, technical deep dives, and architectural concepts for modern software engineering.
          </p>
        </section>

        {/* Featured Blog */}
        {featured && (
          <section className="px-6 md:px-16 max-w-7xl mx-auto mb-16">
            <Link href={`/blogs/${featured.slug}`} className="group block">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-outline/10 group-hover:border-outline/30 transition-all">
                <div className="relative h-64 lg:h-auto">
                  <Image src={featured.image} alt={featured.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-background/30 hidden lg:block" />
                </div>
                <div className="bg-surface-low p-10 md:p-14 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="bg-primary/10 text-primary font-display font-bold text-[9px] uppercase tracking-widest px-3 py-1.5 rounded">
                      {featured.category}
                    </span>
                    <span className="flex items-center gap-1.5 font-display text-[9px] uppercase tracking-widest text-foreground/35 font-bold">
                      <Clock size={10} /> {featured.readTime}
                    </span>
                    <span className="flex items-center gap-1.5 font-display text-[9px] uppercase tracking-widest text-foreground/35 font-bold">
                      <CalendarDays size={10} /> {new Date(featured.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-black tracking-tighter mb-5 leading-tight">{featured.title}</h2>
                  <p className="text-foreground/55 font-body text-balance mb-8 line-clamp-2 md:line-clamp-none">
                    {featured.description}
                  </p>
                  <span className="inline-flex items-center gap-2 font-display font-bold text-[10px] uppercase tracking-widest text-primary group-hover:gap-4 transition-all">
                    Read Article <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Other Blogs */}
        {rest.length > 0 && (
          <section className="px-6 md:px-16 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rest.map((blog) => (
                <Link key={blog.id} href={`/blogs/${blog.slug}`} className="group block h-full">
                  <GlassCard hoverEffect glowColor="primary" className="h-full flex flex-col">
                    <div className="relative h-48 rounded-lg overflow-hidden mb-6 -mx-6 -mt-6">
                      <Image src={blog.image} alt={blog.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-low via-surface-low/40 to-transparent" />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="bg-secondary/10 text-secondary font-display font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded">
                        {blog.category}
                      </span>
                      <span className="flex items-center gap-1 font-display text-[9px] uppercase tracking-widest text-foreground/35">
                        <Clock size={10} /> {blog.readTime}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-black tracking-tighter mb-3 leading-tight group-hover:text-primary transition-colors flex-grow">{blog.title}</h3>
                    <p className="font-body text-sm text-foreground/55 leading-relaxed line-clamp-3 mb-6">{blog.description}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-display text-[9px] uppercase tracking-widest text-foreground/35">
                        {new Date(blog.publishedAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2 font-display font-bold text-[9px] uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Read <ArrowRight size={12} />
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="px-6 md:px-16 max-w-3xl mx-auto mt-28 text-center">
          <p className="font-display text-primary uppercase tracking-[0.3em] text-xs font-bold mb-6">Connect</p>
          <h2 className="font-display text-4xl md:text-5xl font-black tracking-tighter mb-6">Enjoying the content?</h2>
          <p className="font-body text-foreground/55 mb-10">Let's discuss how these principles can impact your next software initiative.</p>
          <BuildCTA text="Start a Conversation" href="/contact" />
        </section>
      </main>
      <Footer />
    </div>
  );
}
