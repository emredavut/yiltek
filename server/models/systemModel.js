const mongoose = require("mongoose");

const systemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "System name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "System description is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "System image URL is required"],
    },
  },
  {
    timestamps: true,
  }
);

const System = mongoose.model("System", systemSchema);

module.exports = System;
