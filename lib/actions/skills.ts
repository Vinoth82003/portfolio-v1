"use server";

import connectToDatabase from "@/lib/db/mongodb";
import Skill from "@/models/Skill";
import { revalidatePath } from "next/cache";
import { invalidateCache, getCache, setCache } from "@/lib/redis";

export async function getSkills() {
  const cacheKey = "skills_list";
  const cached = await getCache<any[]>(cacheKey);
  if (cached) return cached;

  await connectToDatabase();
  const skills = await Skill.find().sort({ category: 1, name: 1 }).lean();
  
  const serialized = JSON.parse(JSON.stringify(skills));
  await setCache(cacheKey, serialized, 3600);
  return serialized;
}

export async function createSkill(data: any) {
  await connectToDatabase();
  const skill = new Skill(data);
  await skill.save();
  
  await invalidateCache("skills_list");
  
  revalidatePath("/admin/skills");
  revalidatePath("/");
  return JSON.parse(JSON.stringify(skill));
}

export async function updateSkill(id: string, data: any) {
  await connectToDatabase();
  const skill = await Skill.findByIdAndUpdate(id, data, { new: true });
  
  await invalidateCache("skills_list");
  
  revalidatePath("/admin/skills");
  revalidatePath("/");
  return JSON.parse(JSON.stringify(skill));
}

export async function deleteSkill(id: string) {
  await connectToDatabase();
  await Skill.findByIdAndDelete(id);
  
  await invalidateCache("skills_list");
  
  revalidatePath("/admin/skills");
  revalidatePath("/");
}
