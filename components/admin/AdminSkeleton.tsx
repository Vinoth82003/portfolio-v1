import Skeleton from "@/components/ui/Skeleton";
import GlassCard from "@/components/GlassCard";

export function StatCardSkeleton() {
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="w-4 h-4" />
      </div>
      <Skeleton className="h-3 w-24 mb-2" />
      <Skeleton className="h-10 w-16" />
    </GlassCard>
  );
}

export function ProjectCardSkeleton() {
  return (
    <GlassCard className="overflow-hidden">
      <Skeleton className="h-48 -mx-6 -mt-6 mb-6" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/3 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-6" />
      <div className="flex justify-end gap-2 border-t border-outline/10 pt-4">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
    </GlassCard>
  );
}

export function MessageSkeleton() {
  return (
    <GlassCard>
      <div className="flex gap-6">
        <Skeleton className="w-12 h-12 rounded-full shrink-0" />
        <div className="flex-1 space-y-4">
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export function SkillSkeleton() {
  return (
    <GlassCard className="flex flex-col items-center gap-4 text-center">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div>
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-3 w-12 mx-auto" />
      </div>
      <Skeleton className="w-full h-1 mt-auto" />
    </GlassCard>
  );
}
