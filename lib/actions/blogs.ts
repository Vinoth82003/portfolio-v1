"use server";

import connectToDatabase from "@/lib/db/mongodb";
import Blog from "@/models/Blog";
import { revalidatePath } from "next/cache";

export async function getBlogs() {
  await connectToDatabase();
  return await Blog.find().sort({ createdAt: -1 }).lean();
}

export async function getBlogById(id: string) {
  await connectToDatabase();
  return await Blog.findById(id).lean();
}

export async function createBlog(data: any) {
  await connectToDatabase();
  const blog = await Blog.create(data);
  revalidatePath("/admin/blog-editor");
  revalidatePath("/blogs");
  return JSON.parse(JSON.stringify(blog));
}

export async function updateBlog(id: string, data: any) {
  await connectToDatabase();
  const blog = await Blog.findByIdAndUpdate(id, data, { new: true });
  revalidatePath("/admin/blog-editor");
  revalidatePath("/blogs");
  return JSON.parse(JSON.stringify(blog));
}

export async function deleteBlog(id: string) {
  await connectToDatabase();
  await Blog.findByIdAndDelete(id);
  revalidatePath("/admin/blog-editor");
  revalidatePath("/blogs");
}
