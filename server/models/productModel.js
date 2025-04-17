const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    mainImage: {
      type: String,
      required: [true, "Product main image is required"],
    },
    gallery: [
      {
        type: String,
      },
    ],
    accessories: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        image: {
          type: String,
        },
      },
    ],
    downloadFiles: [
      {
        name: {
          type: String,
          required: true,
        },
        file: {
          type: String,
          required: true,
        },
        fileType: {
          type: String,
          enum: ["pdf", "doc", "image", "other"],
          default: "other",
        },
      },
    ],
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
