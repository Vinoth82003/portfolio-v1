import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Analytics from "@/models/Analytics";
import { startOfDay, subDays, endOfDay } from "date-fns";

export async function GET() {
  try {
    await connectToDatabase();

    const sevenDaysAgo = startOfDay(subDays(new Date(), 7));

    // 1. Daily views and unique visitors
    const dailyStats = await Analytics.aggregate([
      {
        $match: {
          timestamp: { $gte: sevenDaysAgo },
          type: "PAGE_VIEW"
        }
      },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }
          },
          views: { $sum: 1 },
          visitors: { $addToSet: "$sessionId" }
        }
      },
      { $project: { day: "$_id.day", views: 1, visitors: { $size: "$visitors" }, _id: 0 } },
      { $sort: { day: 1 } }
    ]);

    // 2. Average session duration
    const sessionStats = await Analytics.aggregate([
      {
        $match: {
          timestamp: { $gte: sevenDaysAgo },
          type: "SESSION_END",
          duration: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }
          },
          avgDuration: { $avg: "$duration" }
        }
      },
      { $project: { day: "$_id.day", avgDuration: { $round: ["$avgDuration", 1] }, _id: 0 } },
      { $sort: { day: 1 } }
    ]);

    // 3. Top pages
    const topPages = await Analytics.aggregate([
      {
        $match: {
          timestamp: { $gte: sevenDaysAgo },
          type: "PAGE_VIEW"
        }
      },
      {
        $group: {
          _id: "$path",
          views: { $sum: 1 }
        }
      },
      { $project: { path: "$_id", views: 1, _id: 0 } },
      { $sort: { views: -1 } },
      { $limit: 5 }
    ]);

    // 4. Peak engagement hours
    const hourlyStats = await Analytics.aggregate([
      {
        $match: {
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $hour: "$timestamp" },
          count: { $sum: 1 }
        }
      },
      { $project: { hour: "$_id", count: 1, _id: 0 } },
      { $sort: { hour: 1 } }
    ]);

    return NextResponse.json({
      dailyStats,
      sessionStats,
      topPages,
      hourlyStats
    });
  } catch (error) {
    console.error("Admin Analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
