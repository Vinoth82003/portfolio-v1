"use server";

import connectToDatabase from "@/lib/db/mongodb";
import CaseStudy from "@/models/CaseStudy";
import { revalidatePath } from "next/cache";

export async function getCaseStudies() {
  await connectToDatabase();
  return await CaseStudy.find().sort({ createdAt: -1 }).lean();
}

export async function getCaseStudyById(id: string) {
  await connectToDatabase();
  // Support both Mongo ID and Slug
  return await CaseStudy.findOne({ 
    $or: [{ id: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined }]
  }).lean();
}

export async function createCaseStudy(data: any) {
  await connectToDatabase();
  const cs = await CaseStudy.create(data);
  revalidatePath("/admin/case-study-editor");
  revalidatePath("/case-studies");
  return JSON.parse(JSON.stringify(cs));
}

export async function updateCaseStudy(id: string, data: any) {
  await connectToDatabase();
  const cs = await CaseStudy.findByIdAndUpdate(id, data, { new: true });
  revalidatePath("/admin/case-study-editor");
  revalidatePath("/case-studies");
  revalidatePath(`/case-studies/${cs?.id}`);
  return JSON.parse(JSON.stringify(cs));
}

export async function deleteCaseStudy(id: string) {
  await connectToDatabase();
  const cs = await CaseStudy.findByIdAndDelete(id);
  revalidatePath("/admin/case-study-editor");
  revalidatePath("/case-studies");
  if (cs) revalidatePath(`/case-studies/${cs.id}`);
}
