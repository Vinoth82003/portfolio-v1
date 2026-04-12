import mongoose, { Schema, Document } from "mongoose";

export interface ICommentDocument extends Document {
  blogId: string;
  name: string;
  email?: string;
  content: string;
  isAdmin: boolean;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  blogId: { type: String, required: true }, // Using blog slug or ID
  name: { type: String, required: true },
  email: { type: String, required: false },
  content: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Force deletion of existing model in development to ensure schema updates are applied
if (process.env.NODE_ENV === "development" && mongoose.models.Comment) {
  delete mongoose.models.Comment;
}

export default mongoose.models.Comment || mongoose.model<ICommentDocument>("Comment", CommentSchema);
