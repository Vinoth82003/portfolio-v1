import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";

export default function CaseStudyDetailLoading() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero Skeleton */}
        <div className="relative h-[55vh] bg-surface-low animate-pulse overflow-hidden border-b border-outline/10">
          <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-16 pb-16 max-w-7xl mx-auto z-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-20 h-6 bg-secondary/15 rounded animate-pulse" />
              <div className="w-16 h-4 bg-outline/10 rounded animate-pulse" />
            </div>
            <div className="w-64 md:w-[600px] h-16 md:h-24 bg-outline/10 rounded-lg animate-pulse" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-16 pb-28">
          <div className="flex items-center py-10 border-b border-outline/10">
             <div className="w-40 h-4 bg-outline/10 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 pt-14">
            <article className="lg:col-span-2 space-y-14">
              <GlassCard className="border-secondary/20">
                <div className="w-16 h-4 bg-secondary/20 rounded mb-4 animate-pulse" />
                <div className="space-y-3">
                  <div className="w-full h-5 bg-surface-high rounded animate-pulse" />
                  <div className="w-5/6 h-5 bg-surface-high rounded animate-pulse" />
                </div>
              </GlassCard>
              
              <div className="w-full h-[55vh] bg-surface-low rounded-xl animate-pulse" />

              {[1, 2].map((i) => (
                <div key={i}>
                  <div className="w-48 h-8 bg-outline/10 rounded mb-5 animate-pulse" />
                  <div className="space-y-3">
                    <div className="w-full h-5 bg-surface-high rounded animate-pulse" />
                    <div className="w-full h-5 bg-surface-high rounded animate-pulse" />
                    <div className="w-3/4 h-5 bg-surface-high rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </article>

            <aside className="space-y-8 lg:sticky lg:top-28 h-fit">
              <GlassCard>
                <div className="w-40 h-4 bg-outline/10 rounded mb-6 animate-pulse" />
                <div className="w-full h-10 bg-surface-high rounded animate-pulse" />
              </GlassCard>
              <GlassCard>
                <div className="w-32 h-4 bg-outline/10 rounded mb-6 animate-pulse" />
                <div className="space-y-5">
                   {[1, 2].map((i) => (
                     <div key={i} className="flex gap-3">
                        <div className="w-14 h-14 bg-surface-high rounded-lg animate-pulse flex-shrink-0" />
                        <div className="space-y-2 flex-grow">
                          <div className="w-full h-4 bg-outline/10 rounded animate-pulse" />
                          <div className="w-1/2 h-3 bg-outline/10 rounded animate-pulse" />
                        </div>
                     </div>
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
