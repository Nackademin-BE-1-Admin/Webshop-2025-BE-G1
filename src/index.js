import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import testRouter from "./routes/test.js";
import apiDocumentation from "./routes/documentation.js";
import categoryRoutes from "./routes/categories.js";
import { mustBeDeveloper } from "./middleware/test.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors("*"));
app.use(express.json());
app.use(cookieParser());

// logger
app.use((req, res, next) => {
  console.log(`\n\n--- New request ---`)
  console.log(`${req.method} @ ${req.url}`);
  console.log("BODY:", req.body);

  res.on('finish', () => {
    console.log(`- END of ${req.method}${req.url} -`)
  })

  next();
});

// API Documentation route
app.get(["/", "/api", "/api/"], apiDocumentation);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/test", mustBeDeveloper, testRouter);

async function connect() {
  try {
    console.log("Trying to connect...")
    await mongoose.connect(MONGODB_URI || "mongodb://localhost:27017/hakim-livs")
    console.log(`Connected to MongoDB. URI = ${MONGODB_URI || "mongodb://localhost:27017/hakim-livs"}`)
  } catch (error) {
    console.log(error)
    console.log(`⬆⬆⬆ Failed connecting ⬆⬆⬆`)
  }
}

app.listen(PORT,() => {
  connect()
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`)
});

// 