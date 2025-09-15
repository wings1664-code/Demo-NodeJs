import express from 'express';
import { validateCategory, createCategory, getCategories, getCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { authMiddleware } from '../middlewares/auth';
import { Category } from '../config/db';

const router = express.Router();

// API routes
router.post('/', authMiddleware, validateCategory, createCategory);
router.get('/', authMiddleware, getCategories);
router.get('/:id', authMiddleware, getCategory);
router.put('/:id', authMiddleware, validateCategory, updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);

// EJS views
router.get('/list', authMiddleware, async (req, res) => {
  const categories = process.env.DB_TYPE === 'mysql' ? await Category.findAll() : await Category.find();
  res.render('categories/list', { categories });
});
router.get('/add', authMiddleware, (req, res) => res.render('categories/add'));
router.post('/add', authMiddleware, validateCategory, createCategory);
router.get('/edit/:id', authMiddleware, async (req, res) => {
  const category = process.env.DB_TYPE === 'mysql' ? await Category.findByPk(req.params.id) : await Category.findById(req.params.id);
  if (!category) return res.status(404).send('Category not found');
  res.render('categories/edit', { category });
});
router.post('/edit/:id', authMiddleware, validateCategory, updateCategory);

export default router;