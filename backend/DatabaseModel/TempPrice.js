import mongoose from "mongoose";

const tempPriceSchema = new mongoose.Schema(
  {
    itemKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    section: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    estimatedPrice: {
      type: String,
      required: true,
      trim: true,
    },
    realPrice: {
      type: String,
      default: "",
      trim: true,
    },
    isChecked: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("TempPrice", tempPriceSchema);
