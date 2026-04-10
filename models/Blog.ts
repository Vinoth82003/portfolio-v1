import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
  image: string;
  createdAt: Date;
}

const BlogSchema: Schema = new Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  readTime: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
