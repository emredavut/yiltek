const Product = require("../models/productModel");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.page) || 1;
    const category = req.query.category ? { category: req.query.category } : {};
    const isFeatured =
      req.query.featured === "true" ? { isFeatured: true } : {};

    const count = await Product.countDocuments({
      ...category,
      ...isFeatured,
      isActive: true,
    });
    const products = await Product.find({
      ...category,
      ...isFeatured,
      isActive: true,
    })
      .populate("category", "name slug")
      .sort({ order: 1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name slug"
    );

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate(
      "category",
      "name slug"
    );

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      mainImage,
      gallery,
      accessories,
      downloadFiles,
      slug,
      isFeatured,
      order,
    } = req.body;

    const productExists = await Product.findOne({ slug });

    if (productExists) {
      return res
        .status(400)
        .json({ message: "Product with this slug already exists" });
    }

    const product = await Product.create({
      name,
      description,
      category,
      mainImage,
      gallery: gallery || [],
      accessories: accessories || [],
      downloadFiles: downloadFiles || [],
      slug,
      isFeatured: isFeatured || false,
      order: order || 0,
    });

    if (product) {
      res.status(201).json(product);
    } else {
      res.status(400).json({ message: "Invalid product data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      mainImage,
      gallery,
      accessories,
      downloadFiles,
      slug,
      isActive,
      isFeatured,
      order,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.category = category || product.category;
      product.mainImage = mainImage || product.mainImage;
      product.gallery = gallery || product.gallery;
      product.accessories = accessories || product.accessories;
      product.downloadFiles = downloadFiles || product.downloadFiles;
      product.slug = slug || product.slug;
      product.isActive = isActive !== undefined ? isActive : product.isActive;
      product.isFeatured =
        isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.order = order !== undefined ? order : product.order;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    // Önce öne çıkan ürünleri bul
    let featuredProducts = await Product.find({
      isFeatured: true,
      isActive: true,
    })
      .populate("category", "name slug")
      .sort({ order: 1 })
      .limit(8);

    // Eğer öne çıkan ürün yoksa, normal ürünleri getir
    if (featuredProducts.length === 0) {
      featuredProducts = await Product.find({
        isActive: true,
      })
        .populate("category", "name slug")
        .sort({ _id: -1 }) // En son eklenen ürünler
        .limit(8);
    }

    res.json(featuredProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
};
