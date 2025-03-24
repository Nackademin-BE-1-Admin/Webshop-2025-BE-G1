import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import testRouter from './routes/test.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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
        "POST /api/products": "Create a new product (Admin only)",
        "PUT /api/products/:id": "Update a product (Admin only)",
        "DELETE /api/products/:id": "Delete a product (Admin only)"
      },
      test: {
        "POST /api/test/addProduct": "Add a product",
        "POST /api/test/addProducts": "Add multiple products",
        
      }
    },
    authentication: "Use Bearer token in Authorization header for protected routes"
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/test', testRouter)

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hakim-livs')
  .then(() => console.log('Connected to MongoDB', process.env.MONGODB_URI))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});