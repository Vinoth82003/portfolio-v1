import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  type: string;
  desc: string;
  tech: string[];
  link: string;
  image: string;
  content: string;
  createdAt: Date;
}

const ProjectSchema: Schema = new Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  desc: { type: String, required: true },
  tech: { type: [String], required: true },
  link: { type: String, required: true },
  image: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
