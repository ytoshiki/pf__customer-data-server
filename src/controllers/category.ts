import { Request, Response } from 'express';
import { Category } from '../models/category';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({});

    if (!categories.length) {
      return res.status(401).json({
        success: false,
        message: 'Categories Not Found'
      });
    }

    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const mandatoryFields = ['name', 'image', 'heading'];
    const reqBody = req.body;

    const isFilled = (f: string) => reqBody[f];
    const validRequest = mandatoryFields.every(isFilled);

    if (!validRequest) {
      return res.status(401).json({
        success: false,
        message: 'You need to include name, image, heading and paragraph'
      });
    }

    const category = new Category(req.body);

    const newCategory = await category.save();

    res.status(201).json({
      success: true,
      newCategory
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndRemove(req.params.id);

    if (!category) {
      return res.status(401).json({
        success: false,
        message: 'Category Not Found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updateCategoryById = async (req: Request, res: Response) => {
  if (!req.body.name && !req.body.image && !req.body.heading && !req.body.paragraph) {
    return res.status(401).json({
      success: false,
      message: 'You need to include name, image url, heading or paragraph'
    });
  }
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!category) {
      return res.status(401).json({
        success: false,
        message: 'Category Not Found'
      });
    }

    res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
