import express from 'express';
import { addReview, getAllReviews, updateReviewById, deleteReviewById, getReviewById, calcSatisfaction, getReviewsByProductId, getReviewsByCustomerId } from '../controllers/review';
const router = express.Router();

router.route('/').get(getAllReviews).post(addReview);

router.route('/satisfaction').get(calcSatisfaction);

router.route('/:id').get(getReviewById).post(updateReviewById).delete(deleteReviewById);

router.route('/product/:id').get(getReviewsByProductId);

router.route('/customer/:id').get(getReviewsByCustomerId);

export default router;
