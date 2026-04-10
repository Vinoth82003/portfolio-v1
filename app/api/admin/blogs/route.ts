import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Blog from "@/models/Blog";

export async function GET() {
  await connectToDatabase();
  const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ blogs, count: blogs.length });
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();
  if (!body.title || !body.content) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const blog = await Blog.create(body);
  return NextResponse.json({ blog }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const body = await req.json();
  const blog = await Blog.findByIdAndUpdate(id, body, { new: true });
  if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ blog });
}

export async function DELETE(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await Blog.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
