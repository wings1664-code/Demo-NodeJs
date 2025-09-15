import express from 'express';
import { validateRegister, validateLogin, register, login, getUsers } from '../controllers/userController';
import { authMiddleware } from '../middlewares/auth'; // Add this import
import { User } from '../config/db';

const router = express.Router();

// API routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/', authMiddleware, getUsers);

// EJS views
router.get('/list', authMiddleware, async (req, res) => {
  const users = process.env.DB_TYPE === 'mysql' ? await User.findAll() : await User.find(); // List view
  res.render('users/list', { users });
});
router.get('/add', (req, res) => res.render('users/add')); // Register form
router.post('/add', validateRegister, register); // Handle form
router.get('/login-view', (req, res) => res.render('users/login'));
router.post('/login-view', validateLogin, login);

export default router;