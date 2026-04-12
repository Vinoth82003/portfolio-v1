import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";

export default function ProjectDetailLoading() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero Skeleton */}
        <div className="relative h-[60vh] bg-surface-low animate-pulse overflow-hidden border-b border-outline/10">
          <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-16 pb-16 max-w-7xl mx-auto z-10">
            <div className="w-24 h-4 bg-outline/10 rounded mb-4 animate-pulse" />
            <div className="w-64 md:w-[600px] h-16 md:h-24 bg-outline/10 rounded-lg mb-6 animate-pulse" />
            <div className="w-48 h-5 bg-outline/10 rounded animate-pulse" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-16 pb-28">
           {/* Back link + Actions Skeleton */}
          <div className="flex items-center justify-between py-10 border-b border-outline/10">
            <div className="w-32 h-4 bg-outline/10 rounded animate-pulse" />
            <div className="flex gap-3">
              <div className="w-24 h-10 bg-outline/10 rounded-md animate-pulse" />
              <div className="w-28 h-10 bg-primary/20 rounded-md animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 pt-16">
            <div className="lg:col-span-2 space-y-16">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="w-24 h-4 bg-outline/10 rounded mb-5 animate-pulse" />
                  <div className="space-y-3">
                    <div className="w-full h-5 bg-surface-high rounded animate-pulse" />
                    <div className="w-full h-5 bg-surface-high rounded animate-pulse" />
                    <div className="w-3/4 h-5 bg-surface-high rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>

            <aside className="space-y-8 lg:sticky lg:top-28 h-fit">
              <GlassCard>
                <div className="w-24 h-4 bg-outline/10 rounded mb-6 animate-pulse" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-16 h-6 bg-surface-high rounded animate-pulse" />
                  ))}
                </div>
              </GlassCard>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
