import express from 'express';
import { createCategory, deleteCategoryById, getAllCategories, updateCategoryById } from '../controllers/category';
const router = express.Router();

// GET: get all categories
// POST: create a new category
router.route('/').get(getAllCategories).post(createCategory);

router.route('/:id').delete(deleteCategoryById).patch(updateCategoryById);
export default router;
