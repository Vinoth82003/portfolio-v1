import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";

export default function BlogsLoading() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28 pb-28">
        {/* Header Skeleton */}
        <section className="px-6 md:px-16 max-w-7xl mx-auto mb-20 relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/8 blur-[120px] rounded-full -z-10" />
          <div className="inline-flex items-center gap-2 mb-10 w-24 h-4 bg-outline/10 rounded animate-pulse" />
          <div className="w-20 h-3 bg-primary/20 rounded animate-pulse mb-5" />
          <div className="w-64 h-16 md:w-96 md:h-24 bg-outline/10 rounded-lg animate-pulse mb-6" />
          <div className="w-full max-w-xl h-16 md:h-20 bg-outline/5 rounded-lg animate-pulse" />
        </section>

        {/* Featured Blog Skeleton */}
        <section className="px-6 md:px-16 max-w-7xl mx-auto mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-outline/10 h-[500px] lg:h-[400px] bg-surface-low animate-pulse" />
        </section>

        {/* Other Blogs Skeleton */}
        <section className="px-6 md:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <GlassCard key={i} className="h-full">
                <div className="relative h-48 rounded-lg mb-6 -mx-6 -mt-6 bg-surface-high animate-pulse" />
                <div className="w-32 h-5 bg-outline/10 rounded animate-pulse mb-4" />
                <div className="w-full h-8 bg-outline/10 rounded animate-pulse mb-3" />
                <div className="w-full h-16 bg-outline/5 rounded animate-pulse mb-6" />
                <div className="flex justify-between mt-auto">
                  <div className="w-20 h-4 bg-outline/10 rounded animate-pulse" />
                  <div className="w-16 h-4 bg-outline/10 rounded animate-pulse" />
                </div>
              </GlassCard>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
