import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { Product, Category, Subcategory } from '../config/db';

// Validation chain
export const validateProduct = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('categoryId').notEmpty().withMessage('Category ID is required'),
  body('subcategoryId').notEmpty().withMessage('Subcategory ID is required'),
];

// Create
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const category = process.env.DB_TYPE === 'mysql' ? await Category.findByPk(req.body.categoryId) : await Category.findById(req.body.categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    const subcategory = process.env.DB_TYPE === 'mysql' ? await Subcategory.findByPk(req.body.subcategoryId) : await Subcategory.findById(req.body.subcategoryId);
    if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// Read all
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = process.env.DB_TYPE === 'mysql' ? await Product.findAll({ include: [Category, Subcategory] }) : await Product.find().populate(['categoryId', 'subcategoryId']);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// Read one
export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = process.env.DB_TYPE === 'mysql' ? await Product.findByPk(req.params.id, { include: [Category, Subcategory] }) : await Product.findById(req.params.id).populate(['categoryId', 'subcategoryId']);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// Update
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const product = process.env.DB_TYPE === 'mysql' ? await Product.findByPk(req.params.id) : await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const category = process.env.DB_TYPE === 'mysql' ? await Category.findByPk(req.body.categoryId) : await Category.findById(req.body.categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    const subcategory = process.env.DB_TYPE === 'mysql' ? await Subcategory.findByPk(req.body.subcategoryId) : await Subcategory.findById(req.body.subcategoryId);
    if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
    await product.update(req.body);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// Delete
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = process.env.DB_TYPE === 'mysql' ? await Product.findByPk(req.params.id) : await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};