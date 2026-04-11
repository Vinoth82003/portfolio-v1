import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import CaseStudy from "@/models/CaseStudy";

export async function GET() {
  await connectToDatabase();
  const caseStudies = await CaseStudy.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ caseStudies, count: caseStudies.length });
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    if (!body.title || !body.id) {
      return NextResponse.json({ error: "Title and Slug ID are required" }, { status: 400 });
    }
    const cs = await CaseStudy.create(body);
    return NextResponse.json({ caseStudy: cs }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const body = await req.json();
  const cs = await CaseStudy.findByIdAndUpdate(id, body, { new: true });
  if (!cs) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ caseStudy: cs });
}

export async function DELETE(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await CaseStudy.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
