import express from 'express';
import { addReview, getAllReviews, updateReviewById, deleteReviewById, getReviewById, calcSatisfaction } from '../controllers/review';
const router = express.Router();

router.route('/').get(getAllReviews).post(addReview);

router.route('/satisfaction').get(calcSatisfaction);

router.route('/:id').get(getReviewById).post(updateReviewById).delete(deleteReviewById);

export default router;
