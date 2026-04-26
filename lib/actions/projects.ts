"use server";

import connectToDatabase from "@/lib/db/mongodb";
import Project from "@/models/Project";
import { revalidatePath } from "next/cache";
import { invalidateCache, getCache, setCache } from "@/lib/redis";

export async function getProjects(onlyPublished = false) {
  const cacheKey = onlyPublished ? "projects_published" : "projects_all";
  const cached = await getCache<any[]>(cacheKey);
  if (cached) return cached;

  await connectToDatabase();
  const query = onlyPublished ? { status: "published" } : {};
  const projects = await Project.find(query).sort({ createdAt: -1 }).lean();

  const serialized = JSON.parse(JSON.stringify(projects));
  await setCache(cacheKey, serialized, 3600);
  return serialized;
}

export async function getProjectById(id: string, onlyPublished = false) {
  const cacheKey = `project_${id}${onlyPublished ? '_pub' : ''}`;
  const cached = await getCache<any>(cacheKey);
  if (cached) return cached;

  await connectToDatabase();
  const query: any = {
    $or: [{ id: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined }]
  };
  if (onlyPublished) query.status = "published";
  
  const project = await Project.findOne(query).lean();

  if (project) {
    const serialized = JSON.parse(JSON.stringify(project));
    await setCache(cacheKey, serialized, 3600);
    return serialized;
  }
  return null;
}

export async function createProject(data: any) {
  await connectToDatabase();
  const project = new Project(data);
  await project.save();

  await invalidateCache("projects_all");
  await invalidateCache("projects_published");


  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/projects");
  return JSON.parse(JSON.stringify(project));
}

export async function updateProject(id: string, data: any) {
  await connectToDatabase();
  const project = await Project.findByIdAndUpdate(id, data, { new: true });

  await invalidateCache("projects_all");
  await invalidateCache("projects_published");
  await invalidateCache(`project_${id}`);

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  return JSON.parse(JSON.stringify(project));
}

export async function deleteProject(id: string) {
  await connectToDatabase();
  await Project.findByIdAndDelete(id);

  await invalidateCache("projects_all");
  await invalidateCache("projects_published");
  await invalidateCache(`project_${id}`);

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/projects");
}
