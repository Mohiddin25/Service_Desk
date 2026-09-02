import mongoose from "mongoose";


const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: [true, "Ticket title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Ticket description is required"],
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "hardware",
        "software",
        "network",
        "account_access",
        "security",
        "other",
      ],
      default: "other",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    status: {
      type: String,
      enum: [
        "open",
        "assigned",
        "in_progress",
        "resolved",
        "closed",
        "reopened",
      ],
      default: "open",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    firstRespondedAt: {
      type: Date,
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    closedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;