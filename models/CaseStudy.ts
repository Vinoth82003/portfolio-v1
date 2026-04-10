import mongoose, { Schema, Document } from "mongoose";

export interface ICaseStudy extends Document {
  title: string;
  category: string;
  summary: string;
  content: string;
  outcome: string;
  image: string;
  createdAt: Date;
}

const CaseStudySchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  outcome: { type: String, required: false },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.CaseStudy || mongoose.model<ICaseStudy>("CaseStudy", CaseStudySchema);
