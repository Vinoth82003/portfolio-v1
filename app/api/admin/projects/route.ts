import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Project from "@/models/Project";

export async function GET() {
  await connectToDatabase();
  const projects = await Project.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ projects, count: projects.length });
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();
  if (!body.title || !body.content) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const project = await Project.create(body);
  return NextResponse.json({ project }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const body = await req.json();
  const project = await Project.findByIdAndUpdate(id, body, { new: true });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ project });
}

export async function DELETE(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await Project.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
