import express from 'express';
import { addProduct, deleteProductById, getAllProducts, getProductById } from '../controllers/product';
const router = express.Router();

router.route('/').get(getAllProducts).post(addProduct);

router.route('/:id').get(getProductById).delete(deleteProductById);

export default router;
