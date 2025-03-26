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
router.delete("/", adminAuth, async (req, res) => {
  try {
    if (req.body.name) {
      await Product.findOneAndDelete({ name: req.body.name })
    } else if (req.body.id) {
      await Product.findByIdAndDelete(req.body.id)
    } else {
      res.status(400)
      return res.json({ error: `You must provide a name or id field.`})
    }
  } catch (error) {
    res.status(500)
    res.json({ error: error?.message })
  }
})

// Get products by category
router.get("/by-category/:category", async (req, res) => {

  const category = await Category.findOne({ name: req.params.category })

  if (!category) {
    res.status(404)
    res.json({
      error: `No category by the name of "${req.params.category}" was found. See /api/categories for a list of categories.`
    })
    return
  }

  // fetch products
  const products = await Product.find({ category: category._id });

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
