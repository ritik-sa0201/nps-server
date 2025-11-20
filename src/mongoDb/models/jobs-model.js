import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      required: true,
    },
    experienceRequired: {
      type: String,
      required: true,
    },
    roleType: {
      type: String,
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Career", careerSchema);
