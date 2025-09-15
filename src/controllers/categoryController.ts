import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { Category } from '../config/db';

// Validation chain
export const validateCategory = [
  body('name').notEmpty().trim().withMessage('Name is required'),
];

// Create
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

// Read all
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = process.env.DB_TYPE === 'mysql' ? await Category.findAll() : await Category.find();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

// Read one
export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = process.env.DB_TYPE === 'mysql' ? await Category.findByPk(req.params.id) : await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

// Update
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const category = process.env.DB_TYPE === 'mysql' ? await Category.findByPk(req.params.id) : await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.update(req.body);
    res.json(category);
  } catch (err) {
    next(err);
  }
};

// Delete
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = process.env.DB_TYPE === 'mysql' ? await Category.findByPk(req.params.id) : await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.destroy();
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};