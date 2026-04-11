import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String },
    period: { type: String, required: true }, // e.g., "2021 - Present"
    description: { type: String, required: true },
    technologies: [{ type: String }],
    isCurrent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Experience || mongoose.model("Experience", experienceSchema);
