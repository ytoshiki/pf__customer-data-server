import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import { Category } from '../models/category';
import { Product } from '../models/product';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({}).populate('category');

    if (!products.length) {
      return res.status(401).json({
        success: false,
        message: 'Products Not Found'
      });
    }

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {}
};

export const addProduct = async (req: Request, res: Response) => {
  const mandatoryFields = ['name', 'price', 'images', 'category'];
  const validate = (f: string) => req.body[f];
  const isValid = mandatoryFields.every(validate);
  if (!isValid) {
    return res.status(401).json({
      succcess: false,
      message: 'You need to include name, price, images and category'
    });
  }

  try {
    const category = await Category.findById(req.body.category);

    if (!category) {
      return res.status(401).json({
        success: false,
        message: 'Category Not Found'
      });
    }

    const product = new Product(req.body);
    const newProduct = await product.save();

    if (!newProduct) {
      return res.status(500).json({
        success: false,
        message: 'something went wrong. Try again'
      });
    }

    const categoryAddProduct = await Category.findByIdAndUpdate(
      req.body.category,
      {
        $push: {
          products: newProduct._id
        }
      },
      {
        new: true
      }
    );

    if (!categoryAddProduct) {
      return res.status(500).json({
        success: false,
        message: 'Category failed to add product'
      });
    }

    res.status(201).json({
      success: true,
      newProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteProductById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(401).json({
        success: false,
        message: 'Product Not Found'
      });
    }

    await Category.filterProductById(id as any);

    res.status(200).json({
      success: true,
      message: 'Product deleted Successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.find({ _id: req.params.id }).populate('category');

    if (!product) {
      return res.status(401).json({
        success: false,
        message: 'Product Not Found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {}
};
