import express from 'express';
import { addReview, getAllReviews, updateReviewById, deleteReviewById } from '../controllers/review';
const router = express.Router();

router.route('/').get(getAllReviews).post(addReview);

router.route('/:id').post(updateReviewById).delete(deleteReviewById);

export default router;
