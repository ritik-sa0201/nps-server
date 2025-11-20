import mongoose from "mongoose";

const querySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    query: {
      type: String,
      required: true,
      trim: true,
    },
    isAddressed: {
      type: Boolean,
      default: false, // false means not yet addressed
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

export default mongoose.model("Query", querySchema);
