import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import testRouter from './routes/test.js';
import categoryRoutes from './routes/categories.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI

// Middleware
app.use(cors('*'));
app.use(express.json());

// logger
app.use((req, res, next) => {
  console.log(`${req.method} @ ${req.url}`)
  console.log("BODY:", req.body)
  next()
})

// API Documentation route
app.get('/api', (req, res) => {
  res.json({
    name: "Hakim Livs API",
    version: "1.0.0",
    endpoints: {
      auth: {
        "POST /api/auth/register": "Register a new user",
        "POST /api/auth/login": "Login with username and password"
      },
      products: {
        "GET /api/products": "Get all products",
        "GET /api/products/:id": "Get a single product by ID",
        "GET /api/products/by-category/:category": "Get all products of a given category (No colon!)",
        "POST /api/products": "Create a new product (Admin only)",
        "PUT /api/products/:id": "Update a product (Admin only) (No colon!)",
        "DELETE /api/products/": "Delete a product (Admin only with id OR name in JSON body)",
        "DELETE /api/products/:id": "Delete a product (Admin only with id as the URL parameter [No colon!])",
      },
      categories: {
        "GET /api/categories": "Get all categories"
      },
      test: {
        "POST /api/test/addProduct": "Add a product",
        "POST /api/test/addProducts": "Add multiple products",
        "POST /api/test/addCategory": "Add a category",
        "POST /api/test/addCategories": "Add multiple categories",
        "DELETE /api/test/purgeProducts": "Delete all products",
        "DELETE /api/test/purgeCategories": "Delete all categories",
        "DELETE /api/test/purgeAll": "Delete all products and categories",
      }
    },
    authentication: "Use Bearer token in Authorization header for protected routes"
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes)
app.use('/api/test', testRouter)

// Connect to MongoDB
mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/hakim-livs')
  .then(() => console.log('Connected to MongoDB', MONGODB_URI))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});