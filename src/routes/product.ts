import express from 'express';
import { addProduct, deleteProductById, getAllProducts, getProductById, getProductByName, getProductsByCategory, getProductsWithRating, getRecentProducts, updateProductById } from '../controllers/product';
import { authenticateToken } from '../middleware';
const router = express.Router();

router.route('/').get(getAllProducts).post(authenticateToken, addProduct);

router.route('/rating').get(getProductsWithRating);

router.route('/recent').get(getRecentProducts);

router.route('/name/:name').get(getProductByName);

router.route('/category/:category').get(getProductsByCategory);

router.route('/:id').get(getProductById).delete(authenticateToken, deleteProductById).put(authenticateToken, updateProductById);
export default router;
