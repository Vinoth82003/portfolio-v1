"use server";

import connectToDatabase from "@/lib/db/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { revalidatePath } from "next/cache";

export async function getMessages() {
  await connectToDatabase();
  return await ContactMessage.find().sort({ createdAt: -1 }).lean();
}

export async function updateMessageStatus(id: string, status: string) {
  await connectToDatabase();
  await ContactMessage.findByIdAndUpdate(id, { status });
  revalidatePath("/admin/messages");
  revalidatePath("/admin/dashboard");
}

export async function deleteMessage(id: string) {
  await connectToDatabase();
  await ContactMessage.findByIdAndDelete(id);
  revalidatePath("/admin/messages");
  revalidatePath("/admin/dashboard");
}
