import express from 'express';
import { createPurchase, logAllPurchases } from '../controllers/purchase';
const router = express.Router();

router.route('/').get(logAllPurchases).post(createPurchase);

export default router;
