import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; // Add this import
import { User, Category, Subcategory, Product } from '../config/db';

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI!);

  // Clear data
  await User.deleteMany({});
  await Category.deleteMany({});
  await Subcategory.deleteMany({});
  await Product.deleteMany({});

  // Sample data
  const user = await User.create({ 
    username: 'admin', 
    email: 'admin@example.com', 
    password: await bcrypt.hash('password', 10) 
  });

  const cat1 = await Category.create({ name: 'Electronics' });
  const cat2 = await Category.create({ name: 'Books' });

  const sub1 = await Subcategory.create({ name: 'Phones', categoryId: cat1._id });
  const sub2 = await Subcategory.create({ name: 'Fiction', categoryId: cat2._id });

  await Product.create({ name: 'iPhone', price: 999, categoryId: cat1._id, subcategoryId: sub1._id });
  await Product.create({ name: 'Novel', price: 20, categoryId: cat2._id, subcategoryId: sub2._id });

  console.log('Seeded MongoDB');
  process.exit(0);
}

if (process.env.DB_TYPE === 'mongodb') {
  seed();
} else {
  console.log('Seed only for MongoDB');
}