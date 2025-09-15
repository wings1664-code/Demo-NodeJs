import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';

dotenv.config();

// Initialize sequelize as non-null for MySQL
export let sequelize: Sequelize; // Non-null type
let db: typeof mongoose | null = null;

export const connectDB = async () => {
  const DB_TYPE = process.env.DB_TYPE;

  if (DB_TYPE === 'mysql') {
    sequelize = new Sequelize(process.env.MYSQL_DATABASE!, process.env.MYSQL_USER!, process.env.MYSQL_PASSWORD, {
      host: process.env.MYSQL_HOST,
      dialect: 'mysql',
      logging: false,
    });
    try {
      await sequelize.authenticate();
      console.log('MySQL connected');
      await sequelize.sync({ alter: true });
    } catch (error) {
      console.error('MySQL connection error:', error);
      process.exit(1);
    }
  } else if (DB_TYPE === 'mongodb') {
    try {
      db = await mongoose.connect(process.env.MONGODB_URI!);
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  } else {
    throw new Error('Invalid DB_TYPE in .env');
  }
};

// Export models based on DB_TYPE
export let User: any;
export let Category: any;
export let Subcategory: any;
export let Product: any;

// Load models after connectDB
export const initializeModels = () => {
  if (process.env.DB_TYPE === 'mysql') {
    User = require('../models/mysql/user').default;
    Category = require('../models/mysql/category').default;
    Subcategory = require('../models/mysql/subcategory').default;
    Product = require('../models/mysql/product').default;
  } else if (process.env.DB_TYPE === 'mongodb') {
    User = require('../models/mongo/user').default;
    Category = require('../models/mongo/category').default;
    Subcategory = require('../models/mongo/subcategory').default;
    Product = require('../models/mongo/product').default;
  }
};