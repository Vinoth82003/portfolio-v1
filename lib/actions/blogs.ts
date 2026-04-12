"use server";

import connectToDatabase from "@/lib/db/mongodb";
import Blog from "@/models/Blog";
import { revalidatePath } from "next/cache";
import { invalidateCache, getCache, setCache } from "@/lib/redis";

export async function getBlogs() {
  const cacheKey = "blogs_list";
  const cached = await getCache<any[]>(cacheKey);
  if (cached) return cached;

  await connectToDatabase();
  console.log("Fetching blogs from DB...");
  const blogs = await Blog.find().sort({ publishedAt: -1 }).lean();
  console.log(`Found ${blogs.length} blogs in DB.`);

  const serialized = JSON.parse(JSON.stringify(blogs));
  await setCache(cacheKey, serialized, 3600);
  return serialized;
}

export async function getBlogById(id: string) {
  const cacheKey = `blog_${id}`;
  const cached = await getCache<any>(cacheKey);
  if (cached) return cached;

  await connectToDatabase();
  const blog = await Blog.findOne({
    $or: [{ id: id }, { slug: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined }]
  }).lean();

  if (blog) {
    const serialized = JSON.parse(JSON.stringify(blog));
    await setCache(cacheKey, serialized, 3600);
    return serialized;
  }
  return null;
}

export async function createBlog(data: any) {
  await connectToDatabase();
  const blog = new Blog(data);
  await blog.save();

  await invalidateCache("blogs_list");

  revalidatePath("/admin/blog-editor");
  revalidatePath("/");
  revalidatePath("/blogs");
  return JSON.parse(JSON.stringify(blog));
}

export async function updateBlog(id: string, data: any) {
  await connectToDatabase();
  const blog = await Blog.findByIdAndUpdate(id, data, { new: true });

  await invalidateCache("blogs_list");
  await invalidateCache(`blog_${id}`);
  if (blog?.slug) await invalidateCache(`blog_${blog.slug}`);
  if (blog?.id) await invalidateCache(`blog_${blog.id}`);

  revalidatePath("/admin/blog-editor");
  revalidatePath("/");
  revalidatePath("/blogs");
  revalidatePath(`/blogs/${id}`);
  if (blog?.slug) revalidatePath(`/blogs/${blog.slug}`);
  if (blog?.id) revalidatePath(`/blogs/${blog.id}`);

  return JSON.parse(JSON.stringify(blog));
}

export async function deleteBlog(id: string) {
  await connectToDatabase();
  const blog = await Blog.findByIdAndDelete(id);

  await invalidateCache("blogs_list");
  await invalidateCache(`blog_${id}`);
  if (blog?.slug) await invalidateCache(`blog_${blog.slug}`);
  if (blog?.id) await invalidateCache(`blog_${blog.id}`);

  revalidatePath("/admin/blog-editor");
  revalidatePath("/");
  revalidatePath("/blogs");
}
