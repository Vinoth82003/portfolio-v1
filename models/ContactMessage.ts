import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["UNREAD", "READ", "ARCHIVED"],
      default: "UNREAD"
    },
  },
  { timestamps: true }
);

export default mongoose.models.ContactMessage || mongoose.model("ContactMessage", contactMessageSchema);
