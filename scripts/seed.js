import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../src/models/Category.js";
import Product from "../src/models/Product.js";
import fs from "fs";

dotenv.config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI /*  || "mongodb://localhost:27017/hakim-livs"*/);

    // Rensa databasen
    await Category.deleteMany();
    await Product.deleteMany();

    // Ladda kategorier
    const categoriesData = JSON.parse(fs.readFileSync("./src/data/categories.json"));
    const createdCategories = await Category.insertMany(categoriesData);

    // Gör ett lookup-objekt
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.namn] = cat._id;
    });

    // Ladda produkter
    const productsData = JSON.parse(fs.readFileSync("./src/data/products.json"));
    const productsWithIds = productsData.map(p => ({
      ...p,
      kategorier: p.kategorier.map(namn => categoryMap[namn]),
    }));

    // Ta bort det tillfälliga fältet(jag gör ej det nu för ska ha kvar infon så att den sparas)
   // productsWithIds.forEach(p => delete p.kategorier);

    await Product.insertMany(productsWithIds);

    console.log("✅ Seed complete!");
    process.exit();
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
}

seedDatabase();
