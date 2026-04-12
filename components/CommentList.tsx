"use client";

import { useTransition } from "react";
import { Trash2, User } from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteComment } from "@/lib/actions/comments";
import { formatDistanceToNow } from "date-fns"; // Need to check if date-fns is installed, or use native

interface CommentListProps {
  comments: any[];
  blogId: string;
  isAdmin: boolean;
}

export default function CommentList({ comments, blogId, isAdmin }: CommentListProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    startTransition(async () => {
      try {
        await deleteComment(commentId, blogId);
        toast.success("Comment deleted");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete comment");
      }
    });
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-12 border border-outline/10 rounded-2xl bg-surface-low/30">
        <p className="font-body text-foreground/40 text-sm italic">No thoughts shared yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div 
          key={comment._id} 
          className="group relative bg-surface-low/50 border border-outline/10 p-6 rounded-2xl hover:border-primary/20 transition-all"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-background border border-outline/10 flex items-center justify-center text-primary/60">
                <User size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-display font-bold text-sm tracking-tight">{comment.name}</p>
                  {comment.isAdmin && (
                    <span className="bg-primary/20 text-primary text-[8px] uppercase tracking-widest px-2 py-0.5 rounded font-bold">Admin</span>
                  )}
                </div>
                <p className="font-display text-[9px] uppercase tracking-widest text-foreground/40 mt-0.5">
                  {new Date(comment.createdAt).toLocaleDateString()} · {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={() => handleDelete(comment._id)}
                disabled={isPending}
                className="p-2 rounded-lg hover:bg-error/10 text-foreground/20 hover:text-error transition-all"
                title="Delete Comment"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <div className="pl-[52px]">
             <p className="font-body text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
