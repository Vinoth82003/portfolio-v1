import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  id: string; // URL slug
  title: string;
  type: string;
  year: string;
  description: string;
  tech: string[];
  link: string;
  image: string;
  accent?: string;
  heroImage?: string;
  github?: string;
  overview?: string;
  challenge?: string;
  solution?: string;
  outcome?: string;
  gallery?: string[];
  status: "draft" | "published";
  createdAt: Date;
}

const ProjectSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  year: { type: String, required: true },
  description: { type: String, required: true },
  tech: { type: [String], required: true },
  link: { type: String, required: true },
  image: { type: String, required: true },
  accent: { type: String },
  heroImage: { type: String },
  github: { type: String },
  overview: { type: String },
  challenge: { type: String },
  solution: { type: String },
  outcome: { type: String },
  gallery: { type: [String] },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  createdAt: { type: Date, default: Date.now },
});

// Force deletion of existing model in development to ensure schema updates are applied
if (process.env.NODE_ENV === "development" && mongoose.models.Project) {
  delete mongoose.models.Project;
}

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
