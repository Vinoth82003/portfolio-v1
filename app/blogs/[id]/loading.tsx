import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";

export default function BlogDetailLoading() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Header Region Skeleton */}
        <div className="max-w-4xl mx-auto px-6 md:px-16 pt-20 pb-10 text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="w-16 h-6 bg-primary/10 rounded animate-pulse" />
            <div className="w-20 h-4 bg-outline/10 rounded animate-pulse" />
            <div className="w-24 h-4 bg-outline/10 rounded animate-pulse" />
          </div>
          <div className="w-full max-w-2xl h-16 md:h-20 bg-outline/10 rounded-lg mx-auto mb-8 animate-pulse" />
          <div className="w-full max-w-xl h-24 bg-outline/5 rounded-lg mx-auto mb-8 animate-pulse" />
          <div className="flex items-center justify-center gap-3">
             <div className="h-[1px] w-12 bg-outline/20" />
             <div className="w-20 h-4 bg-outline/10 rounded animate-pulse" />
             <div className="h-[1px] w-12 bg-outline/20" />
          </div>
        </div>

        {/* Hero Image Skeleton */}
        <div className="max-w-6xl mx-auto px-6 md:px-16 mb-20">
          <div className="h-[40vh] md:h-[60vh] rounded-3xl bg-surface-low border border-outline/10 animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-16 pb-28">
          <div className="flex items-center py-6 border-b border-outline/10 mb-14">
             <div className="w-32 h-4 bg-outline/10 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16 lg:gap-24">
            {/* Article Body Skeleton */}
            <article className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-4">
                  {i % 2 === 0 && <div className="w-1/2 h-8 bg-outline/10 rounded mb-6 animate-pulse" />}
                  <div className="w-full h-4 bg-surface-high rounded animate-pulse" />
                  <div className="w-full h-4 bg-surface-high rounded animate-pulse" />
                  <div className="w-5/6 h-4 bg-surface-high rounded animate-pulse" />
                </div>
              ))}
            </article>

            {/* Sidebar Skeleton */}
            <aside className="space-y-8 lg:sticky lg:top-28 h-fit">
              <GlassCard>
                <div className="w-24 h-4 bg-outline/10 rounded mb-6 animate-pulse" />
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-high animate-pulse" />
                  <div className="w-10 h-10 rounded-full bg-surface-high animate-pulse" />
                  <div className="w-10 h-10 rounded-full bg-surface-high animate-pulse" />
                </div>
              </GlassCard>
              <GlassCard>
                <div className="w-32 h-4 bg-outline/10 rounded mb-6 animate-pulse" />
                <div className="w-full h-16 bg-surface-high rounded mb-6 animate-pulse" />
                <div className="w-full h-10 bg-outline/10 rounded animate-pulse" />
              </GlassCard>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
