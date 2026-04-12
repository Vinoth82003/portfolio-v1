import { getComments } from "@/lib/actions/comments";
import { getSession } from "@/lib/auth";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import GlassCard from "./GlassCard";

interface CommentSectionProps {
  blogId: string;
}

export default async function CommentSection({ blogId }: CommentSectionProps) {
  const comments = await getComments(blogId);
  const session = await getSession();
  const isAdmin = !!session;

  return (
    <div className="mt-20 space-y-12">
      <div className="flex flex-col gap-4">
          <p className="font-display text-primary uppercase tracking-[0.3em] text-xs font-bold">Dialogue</p>
          <h2 className="font-display text-3xl md:text-4xl font-black tracking-tighter">Share Your Thoughts</h2>
      </div>

      <GlassCard className="!p-8">
        <CommentForm blogId={blogId} />
      </GlassCard>

      <div className="space-y-8">
        <div className="flex items-center gap-4">
             <div className="h-[1px] flex-1 bg-outline/10" />
             <p className="font-display text-[10px] uppercase tracking-widest text-foreground/40 font-bold">{comments.length} Comments</p>
             <div className="h-[1px] flex-1 bg-outline/10" />
        </div>
        
        <CommentList comments={comments} blogId={blogId} isAdmin={isAdmin} />
      </div>
    </div>
  );
}
