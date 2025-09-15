import express from 'express';
import { validateSubcategory, createSubcategory, getSubcategories, getSubcategory, updateSubcategory, deleteSubcategory } from '../controllers/subcategoryController';
import { authMiddleware } from '../middlewares/auth';
import { Subcategory, Category } from '../config/db';

const router = express.Router();

// API routes
router.post('/', authMiddleware, validateSubcategory, createSubcategory);
router.get('/', authMiddleware, getSubcategories);
router.get('/:id', authMiddleware, getSubcategory);
router.put('/:id', authMiddleware, validateSubcategory, updateSubcategory);
router.delete('/:id', authMiddleware, deleteSubcategory);

// EJS views
router.get('/list', authMiddleware, async (req, res) => {
  const subcategories = process.env.DB_TYPE === 'mysql' ? await Subcategory.findAll({ include: [Category] }) : await Subcategory.find().populate('categoryId');
  const categories = process.env.DB_TYPE === 'mysql' ? await Category.findAll() : await Category.find();
  res.render('subcategories/list', { subcategories, categories });
});
router.get('/add', authMiddleware, async (req, res) => {
  const categories = process.env.DB_TYPE === 'mysql' ? await Category.findAll() : await Category.find();
  res.render('subcategories/add', { categories });
});
router.post('/add', authMiddleware, validateSubcategory, createSubcategory);
router.get('/edit/:id', authMiddleware, async (req, res) => {
  const subcategory = process.env.DB_TYPE === 'mysql' ? await Subcategory.findByPk(req.params.id, { include: [Category] }) : await Subcategory.findById(req.params.id).populate('categoryId');
  const categories = process.env.DB_TYPE === 'mysql' ? await Category.findAll() : await Category.find();
  if (!subcategory) return res.status(404).send('Subcategory not found');
  res.render('subcategories/edit', { subcategory, categories });
});
router.post('/edit/:id', authMiddleware, validateSubcategory, updateSubcategory);

export default router;