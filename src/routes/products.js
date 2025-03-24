import express from "express";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { adminAuth } from "../middleware/auth.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const router = express.Router();

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read products JSON file
const productsJSON = JSON.parse(
  readFileSync(join(__dirname, "../data/products.json"), "utf8")
);

// Get all products
router.get("/", async (req, res) => {
  try {
    //! DONT USE IN PRODUCTION get products from json file
    res.json(productsJSON);
    return;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//TODO Get single product

// Create product (admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//TODO Update product (admin only)

//TODO Delete product (admin only)

// Get products by category
router.get("/by-category/:categories", async (req, res) => {

  // ensure there are is a category or categories in the url
  if (!req.params.categories) {
    res.status(400)
    res.json({ error: `You must provide a category or categories. For example: /api/products/by-category/Food,Pets,Furniture` })
    return
  }

  // fetch products
  const products = await Product.find({ category: { $in: req.params.categories.split(',') } }).lean();

  // error if no products found
  if (products.length <= 0) {
    res.status(404)
    res.json({
      products,
      error: `No products found.`
    })
    return
  }

  // success
  res.json({ products })
  
})

export default router;
