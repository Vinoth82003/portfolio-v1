import mongoose, { Schema, Document } from "mongoose";

export interface ICaseStudySection {
  heading: string;
  content: string;
  code?: string;
}

export interface ICaseStudy extends Document {
  id: string;
  title: string;
  category: string;
  readTime: string;
  description: string;
  image: string;
  heroImage?: string;
  sections: ICaseStudySection[];
  outcome: string[];
  relatedIds: string[];
  status: "draft" | "published";
  createdAt: Date;
}

const CaseStudySchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  readTime: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  heroImage: { type: String },
  sections: [{
    _id: false,
    heading: { type: String, required: true },
    content: { type: String, required: true },
    code: { type: String }
  }],
  outcome: [{ type: String }],
  relatedIds: [{ type: String }],
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  createdAt: { type: Date, default: Date.now },
});

// Force deletion of existing model in development to ensure schema updates are applied
if (process.env.NODE_ENV === "development" && mongoose.models.CaseStudy) {
  delete mongoose.models.CaseStudy;
}

export default mongoose.models.CaseStudy || mongoose.model<ICaseStudy>("CaseStudy", CaseStudySchema);
