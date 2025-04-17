const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the timestamp before saving
GallerySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create a model
const Gallery = mongoose.model("Gallery", GallerySchema);

// Add a default gallery item if there are none
const createDefaultGalleryItem = async () => {
  try {
    const count = await Gallery.countDocuments();
    if (count === 0) {
      console.log("Creating default gallery item...");
      await Gallery.create({
        title: "Demo Image",
        description: "This is a demo image for testing",
        type: "image",
        url: "https://via.placeholder.com/640x360?text=Demo+Image",
      });
      console.log("Default gallery item created!");
    }
  } catch (err) {
    console.error("Error creating default gallery item:", err);
  }
};

// Call the function to add default item
createDefaultGalleryItem();

module.exports = Gallery;
