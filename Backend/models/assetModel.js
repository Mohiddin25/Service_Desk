import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    assetTag: {
      type: String,
      required: [true, "Asset tag is required"],
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: [true, "Asset name is required"],
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "laptop",
        "desktop",
        "software",
        "network",
        "mobile",
        "peripheral",
        "other",
      ],
      default: "other",
    },

    modelNumber: {
      type: String,
      trim: true,
      default: "",
    },

    serialNumber: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["in_inventory", "assigned", "under_repair", "retired"],
      default: "in_inventory",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    purchaseDate: {
      type: Date,
      default: null,
    },

    warrantyExpiration: {
      type: Date,
      default: null,
    },

    cost: {
      type: Number,
      default: 0,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;
