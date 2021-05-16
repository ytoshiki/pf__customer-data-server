import express from 'express';
import { createCategory, deleteCategoryById, getAllCategories, updateCategoryById } from '../controllers/category';
import { authenticateToken } from '../middleware';
const router = express.Router();

// GET: get all categories
// POST: create a new category
router.route('/').get(getAllCategories).post(authenticateToken, createCategory);

router.route('/:id').delete(authenticateToken, deleteCategoryById).patch(authenticateToken, updateCategoryById);
export default router;
