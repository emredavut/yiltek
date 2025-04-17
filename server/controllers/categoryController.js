const Category = require("../models/categoryModel");

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res
      .status(500)
      .json({ message: "Kategoriler getirilirken bir hata oluştu" });
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: "Kategori bulunamadı" });
    }
  } catch (error) {
    console.error("Error fetching category by id:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    console.log("Creating category with data:", req.body);

    // Authentication check
    if (!req.user || req.user.role !== "admin") {
      console.log("Auth check failed. User:", req.user);
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok" });
    }

    const { name, description, image, slug, order, isActive } = req.body;

    // Create slug if not provided
    let categorySlug = slug;
    if (!categorySlug && name) {
      categorySlug = name
        .toLowerCase()
        .replace(/[ğ]/g, "g")
        .replace(/[ü]/g, "u")
        .replace(/[ş]/g, "s")
        .replace(/[ı]/g, "i")
        .replace(/[ö]/g, "o")
        .replace(/[ç]/g, "c")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const category = new Category({
      name,
      description,
      image,
      slug: categorySlug,
      order: order || 0,
      isActive: isActive === undefined ? true : isActive,
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    if (error.code === 11000) {
      res
        .status(400)
        .json({ message: "Bu isimde veya slug'da bir kategori zaten var" });
    } else {
      res
        .status(500)
        .json({ message: "Kategori oluşturulurken bir hata oluştu" });
    }
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, slug, order, isActive } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, description, image, slug, order, isActive },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Kategori bulunamadı" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    if (error.code === 11000) {
      res
        .status(400)
        .json({ message: "Bu isimde veya slug'da bir kategori zaten var" });
    } else {
      res
        .status(500)
        .json({ message: "Kategori güncellenirken bir hata oluştu" });
    }
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Kategori bulunamadı" });
    }

    res.json({ message: "Kategori başarıyla silindi" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Kategori silinirken bir hata oluştu" });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
