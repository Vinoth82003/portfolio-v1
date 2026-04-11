import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String },
    meetingType: { type: String },
    duration: { type: String },
    date: { type: String },
    time: { type: String },
    subject: { type: String },
    message: { type: String },
    status: { 
      type: String, 
      enum: ["UNREAD", "READ", "ARCHIVED"],
      default: "UNREAD"
    },
  },
  { timestamps: true }
);

export default mongoose.models.ContactMessage || mongoose.model("ContactMessage", contactMessageSchema);
