import mongoose, { Schema, Document } from "mongoose";

export interface IBlogDocument extends Document {
  id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  description: string;
  image: string;
  content: string;
  author: string;
  publishedAt: Date;
  createdAt: Date;
}

const BlogSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  readTime: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true, default: "Vinoth S" },
  publishedAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Force deletion of existing model in development to ensure schema updates are applied
if (process.env.NODE_ENV === "development" && mongoose.models.Blog) {
  delete mongoose.models.Blog;
}

export default mongoose.models.Blog || mongoose.model<IBlogDocument>("Blog", BlogSchema);
