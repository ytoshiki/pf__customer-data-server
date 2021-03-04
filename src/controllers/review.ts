import { Request, Response } from 'express';
import { Product } from '../models/product';
import { Review } from '../models/review';

export const addReview = async (req: Request, res: Response) => {
  const mandatoryFields = ['rating', 'product', 'customer'];

  const isFilled = (f: string): boolean => req.body[f];
  const isValid = mandatoryFields.every(isFilled);

  if (!isValid) {
    return res.status(401).json({
      success: false,
      message: 'You need to include rating, product, customer'
    });
  }

  try {
    const product = await Product.findOne({ _id: req.body.product });

    if (!product) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Product'
      });
    }

    const review = new Review(req.body);
    const newReview = await review.save();

    if (!newReview) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong'
      });
    }

    const reviewProduct = await Product.findByIdAndUpdate(
      req.body.product,
      {
        $push: {
          reviews: review._id
        }
      },
      {
        new: true
      }
    );

    if (!reviewProduct) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong'
      });
    }

    res.status(201).json({
      success: true,
      review,
      product: reviewProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({});
    if (!reviews.length) {
      return res.status(401).json({
        success: false,
        message: 'Reviews Not Found'
      });
    }

    res.status(200).json({
      success: true,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateReviewById = async (req: Request, res: Response) => {
  const mandatoryFields = ['product', 'customer'];
  const validateFields = ['rating', 'comment'];

  const isFilled = (f: string): boolean => req.body[f];
  const isValid = mandatoryFields.every(isFilled);

  if (!isValid) {
    return res.status(401).json({
      success: false,
      message: 'You need to include product and customer'
    });
  }

  if (!validateFields.some((f: string) => req.body[f])) {
    return res.status(401).json({
      success: false,
      message: 'You need rating or comment to update your review'
    });
  }

  interface Update {
    comment?: string;
    rating?: number;
  }

  const updateObj: Update = {};

  if (req.body.comment) {
    updateObj.comment = req.body.comment;
  }

  if (req.body.rating) {
    updateObj.rating = req.body.rating;
  }

  try {
    const theReview = await Review.findOne({ _id: req.params.id });

    if (!theReview) {
      return res.status(401).json({
        success: false,
        message: 'Review Not Found'
      });
    }

    if ((theReview as any).customer.toString() !== req.body.customer) {
      return res.status(400).json({
        success: false,
        message: 'You are not allowed to change the review'
      });
    }

    const review = await Review.findByIdAndUpdate(req.params.id, updateObj, { new: true });
    if (!review) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong'
      });
    }

    res.status(200).json({
      success: true,
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteReviewById = async (req: Request, res: Response) => {
  try {
    const review = await Review.findOne({ _id: req.params.id });

    if (!review) {
      return res.status(401).json({
        success: false,
        message: 'Review Not Found'
      });
    }

    if ((review as any).customer.toString() !== req.body.customer) {
      return res.status(401).json({
        success: false,
        message: 'You are not allowed to delete the review'
      });
    }

    const deleteSuccess = await Review.findByIdAndDelete(req.params.id);

    if (!deleteSuccess) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong'
      });
    }

    const isSuccess = Product.filterReviewById(req.params.id);

    if (!isSuccess) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: error.message
    });
  }
};
