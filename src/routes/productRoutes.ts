import express from 'express';
import { validateProduct, createProduct, getProducts, getProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { authMiddleware } from '../middlewares/auth';
import { Product, Category, Subcategory } from '../config/db';

const router = express.Router();

// API routes
router.post('/', authMiddleware, validateProduct, createProduct);
router.get('/', authMiddleware, getProducts);
router.get('/:id', authMiddleware, getProduct);
router.put('/:id', authMiddleware, validateProduct, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

// EJS views
router.get('/list', authMiddleware, async (req, res) => {
  const products = process.env.DB_TYPE === 'mysql' ? await Product.findAll({ include: [Category, Subcategory] }) : await Product.find().populate(['categoryId', 'subcategoryId']);
  const categories = process.env.DB_TYPE === 'mysql' ? await Category.findAll() : await Category.find();
  const subcategories = process.env.DB_TYPE === 'mysql' ? await Subcategory.findAll() : await Subcategory.find();
  res.render('products/list', { products, categories, subcategories });
});
router.get('/add', authMiddleware, async (req, res) => {
  const categories = process.env.DB_TYPE === 'mysql' ? await Category.findAll() : await Category.find();
  const subcategories = process.env.DB_TYPE === 'mysql' ? await Subcategory.findAll() : await Subcategory.find();
  res.render('products/add', { categories, subcategories });
});
router.post('/add', authMiddleware, validateProduct, createProduct);
router.get('/edit/:id', authMiddleware, async (req, res) => {
  const product = process.env.DB_TYPE === 'mysql' ? await Product.findByPk(req.params.id, { include: [Category, Subcategory] }) : await Product.findById(req.params.id).populate(['categoryId', 'subcategoryId']);
  const categories = process.env.DB_TYPE === 'mysql' ? await Category.findAll() : await Category.find();
  const subcategories = process.env.DB_TYPE === 'mysql' ? await Subcategory.findAll() : await Subcategory.find();
  if (!product) return res.status(404).send('Product not found');
  res.render('products/edit', { product, categories, subcategories });
});
router.post('/edit/:id', authMiddleware, validateProduct, updateProduct);

export default router;