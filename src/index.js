import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import testRouter from './routes/test.js';
import apiDocumentation from './routes/documentation.js';
import categoryRoutes from './routes/categories.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI

// Middleware
app.use(cors('*'));
app.use(express.json());
app.use(cookieParser())

// logger
app.use((req, res, next) => {
  console.log(`${req.method} @ ${req.url}`)
  console.log("BODY:", req.body)
  next()
})

// API Documentation route
app.get("/", apiDocumentation)
app.get("/api", apiDocumentation)

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