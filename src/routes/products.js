import express from "express";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { adminAuth } from "../middleware/auth.js";
import mongoose from "mongoose";



const productRoutes = express.Router();


// Get all products
productRoutes.get("/", async (req, res) => {
  try {
    // Fetch products directly from the MongoDB database
    const products = await Product.find();  // This will get all products
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error?.message, errorObj: error });
}
});

//TODO Get single product

// Create product (admin only)
productRoutes.post("/", adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//TODO Update product (admin only)
productRoutes.put("/:id", adminAuth, async (req, res) => {
  const {id} = req.params
  const body = req.body

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
 
      const product = await Product.findByIdAndUpdate(id, body, {
          new: true
      })
      if(!product) {
          return res.status(404).json({ error: "Product not found" });
      }
      res.json(product)
  } catch(error) {
      console.warn("Error updating product", error)
      res.status(500).json({
          error: error.message || "Error updating product"
      })
  }
} )

//TODO Delete product (admin only)

// Get products by category
productRoutes.get("/by-category/:category", async (req, res) => {

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

export default productRoutes;
