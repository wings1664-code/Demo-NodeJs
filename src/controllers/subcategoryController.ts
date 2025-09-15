import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { Subcategory, Category } from '../config/db';

// Validation chain
export const validateSubcategory = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('categoryId').notEmpty().withMessage('Category ID is required'),
];

// Create
export const createSubcategory = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const category = process.env.DB_TYPE === 'mysql' ? await Category.findByPk(req.body.categoryId) : await Category.findById(req.body.categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    const subcategory = await Subcategory.create(req.body);
    res.status(201).json(subcategory);
  } catch (err) {
    next(err);
  }
};

// Read all
export const getSubcategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subcategories = process.env.DB_TYPE === 'mysql' ? await Subcategory.findAll({ include: [Category] }) : await Subcategory.find().populate('categoryId');
    res.json(subcategories);
  } catch (err) {
    next(err);
  }
};

// Read one
export const getSubcategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subcategory = process.env.DB_TYPE === 'mysql' ? await Subcategory.findByPk(req.params.id, { include: [Category] }) : await Subcategory.findById(req.params.id).populate('categoryId');
    if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
    res.json(subcategory);
  } catch (err) {
    next(err);
  }
};

// Update
export const updateSubcategory = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const subcategory = process.env.DB_TYPE === 'mysql' ? await Subcategory.findByPk(req.params.id) : await Subcategory.findById(req.params.id);
    if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
    const category = process.env.DB_TYPE === 'mysql' ? await Category.findByPk(req.body.categoryId) : await Category.findById(req.body.categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await subcategory.update(req.body);
    res.json(subcategory);
  } catch (err) {
    next(err);
  }
};

// Delete
export const deleteSubcategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subcategory = process.env.DB_TYPE === 'mysql' ? await Subcategory.findByPk(req.params.id) : await Subcategory.findById(req.params.id);
    if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
    await subcategory.destroy();
    res.json({ message: 'Subcategory deleted' });
  } catch (err) {
    next(err);
  }
};