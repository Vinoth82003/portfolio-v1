"use server";

import connectToDatabase from "@/lib/db/mongodb";
import Experience from "@/models/Experience";
import { revalidatePath } from "next/cache";
import { invalidateCache, getCache, setCache } from "@/lib/redis";

export async function getExperiences() {
  const cacheKey = "experience_list";
  const cached = await getCache<any[]>(cacheKey);
  if (cached) return cached;

  await connectToDatabase();
  const experiences = await Experience.find().sort({ createdAt: -1 }).lean();
  
  const serialized = JSON.parse(JSON.stringify(experiences));
  await setCache(cacheKey, serialized, 3600);
  return serialized;
}

export async function createExperience(data: any) {
  await connectToDatabase();
  const experience = new Experience(data);
  await experience.save();
  
  await invalidateCache("experience_list");
  
  revalidatePath("/admin/experience");
  revalidatePath("/");
  return JSON.parse(JSON.stringify(experience));
}

export async function updateExperience(id: string, data: any) {
  await connectToDatabase();
  const experience = await Experience.findByIdAndUpdate(id, data, { new: true });
  
  await invalidateCache("experience_list");
  
  revalidatePath("/admin/experience");
  revalidatePath("/");
  return JSON.parse(JSON.stringify(experience));
}

export async function deleteExperience(id: string) {
  await connectToDatabase();
  await Experience.findByIdAndDelete(id);
  
  await invalidateCache("experience_list");
  
  revalidatePath("/admin/experience");
  revalidatePath("/");
}
