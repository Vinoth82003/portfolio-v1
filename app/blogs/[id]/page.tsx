import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, CalendarDays } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import BuildCTA from "@/components/BuildCTA";
import { getBlogs, getBlogById } from "@/lib/actions/blogs";
import BlogShare from "@/components/BlogShare";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

export async function generateStaticParams() {
  const blogs = await getBlogs();
  return blogs.map((b: any) => ({ id: b.slug || b.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const blog = await getBlogById(id);
  if (!blog) return { title: "Blog Not Found" };
  return { title: `${blog.title} | Vinoth S`, description: blog.description };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await getBlogById(id) as any;
  if (!blog) notFound();

  // Fetch all to find latest/related
  const allBlogs = await getBlogs();
  const related = allBlogs.filter((b: any) => b.id !== blog.id).slice(0, 3);

  const formattedDate = new Date(blog.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Header Region */}
        <div className="max-w-4xl mx-auto px-6 md:px-16 pt-20 pb-10 text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <span className="bg-primary/10 text-primary font-display font-bold text-[9px] uppercase tracking-widest px-3 py-1.5 rounded backdrop-blur-sm">
              {blog.category}
            </span>
            <span className="flex items-center gap-1.5 font-display text-[9px] uppercase tracking-widest text-foreground/45 font-bold">
              <Clock size={10} /> {blog.readTime}
            </span>
            <span className="flex items-center gap-1.5 font-display text-[9px] uppercase tracking-widest text-foreground/45 font-bold">
              <CalendarDays size={10} /> {formattedDate}
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black tracking-tighter mb-8">{blog.title}</h1>
          <p className="font-body text-xl text-foreground/60 leading-relaxed max-w-3xl mx-auto mb-8">
            {blog.description}
          </p>
          <div className="flex items-center justify-center gap-3">
             <div className="h-[1px] w-12 bg-outline/20" />
             <p className="font-display text-xs uppercase tracking-widest text-foreground/40 font-bold">By {blog.author}</p>
             <div className="h-[1px] w-12 bg-outline/20" />
          </div>
        </div>

        {/* Hero Image */}
        <div className="max-w-6xl mx-auto px-6 md:px-16 mb-20">
          <div className="relative h-[40vh] md:h-[60vh] overflow-hidden rounded-3xl border border-outline/10">
            <Image src={blog.image} alt={blog.title} fill sizes="(max-width: 1200px) 100vw, 1200px" className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-16 pb-28">
           {/* Back link + Actions */}
          <div className="flex items-center py-6 border-b border-outline/10 mb-14">
            <Link href="/blogs" className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors">
              <ArrowLeft size={14} /> All Blogs
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16 lg:gap-24">
            {/* Article Body */}
            <article className="max-w-none">
              <MarkdownRenderer content={blog.content} />
            </article>

            {/* Sidebar */}
            <aside className="space-y-8 lg:sticky lg:top-28 h-fit">
              <GlassCard>
                <p className="font-display text-[10px] uppercase tracking-[0.3em] text-foreground/35 font-bold mb-6">Share Article</p>
                <BlogShare title={blog.title} slug={blog.slug} />
              </GlassCard>

              <GlassCard>
                <p className="font-display text-[10px] uppercase tracking-[0.3em] text-foreground/35 font-bold mb-6">Let's Connect</p>
                <p className="font-body text-sm text-foreground/55 mb-6 leading-relaxed">Want to discuss this architecture or bring similar tech to your product?</p>
                <BuildCTA text="Start Conversation" href="/contact" className="w-full text-center" />
              </GlassCard>

              {related.length > 0 && (
                <GlassCard>
                  <p className="font-display text-[10px] uppercase tracking-[0.3em] text-foreground/35 font-bold mb-6">Recent Posts</p>
                  <div className="space-y-5">
                    {related.map((r: any) => (
                      <Link key={r.id} href={`/blogs/${r.slug || r.id}`} className="flex flex-col gap-2 group">
                        <p className="font-display font-bold text-sm leading-tight group-hover:text-primary transition-colors">{r.title}</p>
                        <p className="font-display text-[9px] uppercase tracking-widest text-foreground/35">{new Date(r.publishedAt).toLocaleDateString()}</p>
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
