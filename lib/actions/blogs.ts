"use server";

import connectToDatabase from "@/lib/db/mongodb";
import Blog from "@/models/Blog";
import { revalidatePath } from "next/cache";
import { invalidateCache, getCache, setCache } from "@/lib/redis";
import { randomUUID } from "crypto";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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
  if (!data.title || !data.content) {
    throw new Error("Title and content are required");
  }

  await connectToDatabase();

  // Populate missing required fields
  const blogData = {
    ...data,
    id: data.id || randomUUID(),
    slug: data.slug || slugify(data.title),
    description: data.description || data.excerpt || data.title.substring(0, 160),
    category: data.category || "Uncategorized",
    publishedAt: data.publishedAt || new Date(),
    author: data.author || "Vinoth S",
    readTime: data.readTime || "5 min read",
    createdAt: data.createdAt || new Date(),
  };

  const blog = new Blog(blogData);
  await blog.save();

  await invalidateCache("blogs_list");

  revalidatePath("/admin/blog-editor");
  revalidatePath("/");
  revalidatePath("/blogs");
  return JSON.parse(JSON.stringify(blog));
}

export async function updateBlog(id: string, data: any) {
  await connectToDatabase();

  // For updates, fetch existing to merge/populate
  const existing = await Blog.findById(id);
  if (!existing) {
    throw new Error("Blog not found");
  }

  const updateData = {
    ...existing.toObject(),
    ...data,
    // Update slug/id only if title changed and provided
    ...(data.title && !data.slug ? { slug: slugify(data.title) } : {}),
    description: data.description || data.excerpt || existing.description,
    ...(data.publishedAt ? {} : { publishedAt: existing.publishedAt }),
  };

  const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

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
