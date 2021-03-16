import express from 'express';
import { createPurchase, logAllPurchases, getAnnuallData } from '../controllers/purchase';
const router = express.Router();

router.route('/').get(logAllPurchases).post(createPurchase);

router.route('/data').get(getAnnuallData);

export default router;
