import express from 'express';
import { createPurchase, logAllPurchases, getAnnuallData, logPurchase, logPurchasesByCustomerId, logPurchasesByTerm, countItemPurchase } from '../controllers/purchase';
const router = express.Router();

router.route('/').get(logAllPurchases).post(createPurchase);

router.route('/data').get(getAnnuallData);

router.route('/term/:term').get(logPurchasesByTerm);

router.route('/:c_id').get(logPurchasesByCustomerId);

router.route('/product/:p_id').get(countItemPurchase);

router.route('/:c_id/:p_id').get(logPurchase);

export default router;
