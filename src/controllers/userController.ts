import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { User } from '../config/db';

// Validation chains
export const validateRegister = [
  body('username').notEmpty().trim(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
];

export const validateLogin = [
  body('email').isEmail(),
  body('password').notEmpty(),
];

// Register
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

// Login
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;
    let user;
    if (process.env.DB_TYPE === 'mysql') {
      user = await User.findOne({ where: { email } });
    } else {
      user = await User.findOne({ email });
    }
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id || user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

// CRUD for users (protected)
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = process.env.DB_TYPE === 'mysql' ? await User.findAll() : await User.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = process.env.DB_TYPE === 'mysql' ? await User.findByPk(req.params.id) : await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};