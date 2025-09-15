import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB, initializeModels } from './config/db'; // Fixed path
import userRoutes from './routes/userRoutes'; // Fixed path
import categoryRoutes from './routes/categoryRoutes'; // Fixed path
import subcategoryRoutes from './routes/subcategoryRoutes'; // Fixed path
import productRoutes from './routes/productRoutes'; // Fixed path
import errorHandler from './middlewares/errorHandler'; // Fixed path

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to DB and initialize models
const startServer = async () => {
  await connectDB();
  initializeModels(); // Initialize models after DB connection

  // Routes
  app.use('/users', userRoutes);
  app.use('/categories', categoryRoutes);
  app.use('/subcategories', subcategoryRoutes);
  app.use('/products', productRoutes);

  // Error handling
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();