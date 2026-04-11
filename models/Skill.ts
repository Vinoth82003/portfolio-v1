import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { 
      type: String, 
      required: true,
      enum: ["Frontend", "Backend", "Database", "Tools", "Design", "Soft Skills", "Other"]
    },
    level: { type: Number, min: 0, max: 100, default: 0 },
    icon: { type: String }, // Cloudinary URL
  },
  { timestamps: true }
);

// Force deletion of existing model in development to ensure schema updates are applied
if (process.env.NODE_ENV === "development" && mongoose.models.Skill) {
  delete mongoose.models.Skill;
}

export default mongoose.models.Skill || mongoose.model("Skill", skillSchema);
