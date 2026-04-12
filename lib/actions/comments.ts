"use server";

import connectToDatabase from "@/lib/db/mongodb";
import Comment from "@/models/Comment";
import { revalidatePath } from "next/cache";
import { getCache, setCache, invalidateCache } from "@/lib/redis";
import { getSession } from "@/lib/auth";

export async function getComments(blogId: string) {
  const cacheKey = `comments_${blogId}`;
  const cached = await getCache<any[]>(cacheKey);
  if (cached) return cached;

  await connectToDatabase();
  const comments = await Comment.find({ blogId }).sort({ createdAt: -1 }).lean();
  
  const serialized = JSON.parse(JSON.stringify(comments));
  await setCache(cacheKey, serialized, 3600);
  return serialized;
}

export async function addComment(blogId: string, name: string, content: string, email?: string) {
  if (!name || !content || !blogId) {
    throw new Error("Missing required fields");
  }

  await connectToDatabase();
  
  // Check if admin is posting
  const session = await getSession();
  const isAdmin = session?.email === process.env.ADMIN_EMAIL || !!session; 
  // Simple check: if there is a session, we assume it's the admin for this portfolio

  const comment = new Comment({
    blogId,
    name,
    content,
    email,
    isAdmin
  });

  await comment.save();
  await invalidateCache(`comments_${blogId}`);
  
  revalidatePath(`/blogs/${blogId}`);
  return JSON.parse(JSON.stringify(comment));
}

export async function deleteComment(commentId: string, blogId: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized: Admin only");
  }

  await connectToDatabase();
  await Comment.findByIdAndDelete(commentId);
  
  await invalidateCache(`comments_${blogId}`);
  revalidatePath(`/blogs/${blogId}`);
}
