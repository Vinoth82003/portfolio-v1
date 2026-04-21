import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Analytics from "@/models/Analytics";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, path, sessionId, duration, metadata } = body;

    if (!type || !path || !sessionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    await Analytics.create({
      type,
      path,
      sessionId,
      duration,
      metadata,
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
