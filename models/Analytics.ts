import mongoose, { Schema, Document } from "mongoose";

export interface IAnalyticsDocument extends Document {
  type: "PAGE_VIEW" | "SESSION_END" | "INTERACTION";
  path: string;
  sessionId: string;
  duration?: number; // In seconds, for SESSION_END
  metadata?: {
    browser?: string;
    os?: string;
    device?: string;
    referrer?: string;
  };
  timestamp: Date;
}

const AnalyticsSchema: Schema = new Schema({
  type: { 
    type: String, 
    required: true, 
    enum: ["PAGE_VIEW", "SESSION_END", "INTERACTION"] 
  },
  path: { type: String, required: true },
  sessionId: { type: String, required: true },
  duration: { type: Number },
  metadata: {
    browser: String,
    os: String,
    device: String,
    referrer: String,
  },
  timestamp: { type: Date, default: Date.now }
});

// Index for faster queries in the dashboard
AnalyticsSchema.index({ type: 1, timestamp: -1 });
AnalyticsSchema.index({ sessionId: 1 });

if (process.env.NODE_ENV === "development" && mongoose.models.Analytics) {
  delete mongoose.models.Analytics;
}

export default mongoose.models.Analytics || mongoose.model<IAnalyticsDocument>("Analytics", AnalyticsSchema);
