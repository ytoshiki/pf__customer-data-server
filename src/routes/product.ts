import express from 'express';
import { addProduct, deleteProductById, getAllProducts, getProductById, getProductsWithRating, getRecentProducts } from '../controllers/product';
import { authenticateToken } from '../middleware';
const router = express.Router();

router.route('/').get(getAllProducts).post(addProduct);

router.route('/rating').get(getProductsWithRating);

router.route('/recent').get(getRecentProducts);

router.route('/:id').get(getProductById).delete(deleteProductById);

export default router;
