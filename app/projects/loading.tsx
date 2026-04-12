import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

export default function ProjectsLoading() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28 pb-20">
        {/* Header Skeleton */}
        <section className="px-6 md:px-16 max-w-7xl mx-auto mb-20 relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/8 blur-[120px] rounded-full -z-10" />
          <div className="inline-flex items-center gap-2 mb-10 w-24 h-4 bg-outline/10 rounded animate-pulse" />
          <div className="w-20 h-3 bg-primary/20 rounded animate-pulse mb-5" />
          <div className="w-64 h-16 md:w-96 md:h-24 bg-outline/10 rounded-lg animate-pulse mb-6" />
          <div className="w-full max-w-xl h-16 md:h-20 bg-outline/5 rounded-lg animate-pulse" />
        </section>

        {/* Project Grid Skeleton */}
        <section className="px-6 md:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="block">
                <div className="relative h-[360px] rounded-2xl border border-outline/10 bg-surface-low animate-pulse mb-6" />
                <div className="w-full h-12 bg-surface-low rounded animate-pulse" />
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
