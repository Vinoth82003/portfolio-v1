"use server";

import connectToDatabase from "@/lib/db/mongodb";
import Project from "@/models/Project";
import { revalidatePath } from "next/cache";
import { invalidateCache, getCache, setCache } from "@/lib/redis";

export async function getProjects() {
  const cacheKey = "projects_list";
  const cached = await getCache<any[]>(cacheKey);
  if (cached) return cached;

  await connectToDatabase();
  const projects = await Project.find().sort({ createdAt: -1 }).lean();
  
  await setCache(cacheKey, projects, 3600); // Cache for 1 hour
  return projects;
}

export async function getProjectById(id: string) {
  const cacheKey = `project_${id}`;
  const cached = await getCache<any>(cacheKey);
  if (cached) return cached;

  await connectToDatabase();
  const project = await Project.findOne({ 
    $or: [{ id: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined }]
  }).lean();
  
  if (project) {
    await setCache(cacheKey, project, 3600);
  }
  return project;
}

export async function createProject(data: any) {
  await connectToDatabase();
  const project = new Project(data);
  await project.save();
  
  // Invalidate any cache for projects
  await invalidateCache("projects_list");
  
  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/projects");
  return JSON.parse(JSON.stringify(project));
}

export async function updateProject(id: string, data: any) {
  await connectToDatabase();
  const project = await Project.findByIdAndUpdate(id, data, { new: true });
  
  await invalidateCache("projects_list");
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
  
  await invalidateCache("projects_list");
  await invalidateCache(`project_${id}`);
  
  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/projects");
}
