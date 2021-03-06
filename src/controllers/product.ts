import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import { validateAuth } from '../helper/validateAuth';
import { Category } from '../models/category';
import { Product } from '../models/product';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({}).populate('category');

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: 'Products Not Found'
      });
    }

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'Products Not Found'
    });
  }
};

export const getProductByName = async (req: Request, res: Response) => {
  const name = req.params.name;

  try {
    const product = await Product.findOne({
      name
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product Not Found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'Product Not Found'
    });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.category;

  try {
    const products = await Product.find({
      category: categoryId
    }).populate('category');

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: 'Products Not Found'
      });
    }

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'Products Not Found'
    });
  }
};

export const getRecentProducts = async (req: Request, res: Response) => {
  const now = new Date();

  const lastMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);

  try {
    const products = await Product.find({
      createdAt: {
        $gt: lastMonth
      }
    })
      .populate('category')
      .populate('reviews');

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
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Products Not Found'
    });
  }
};

export const getProductsWithRating = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({}).populate('reviews');

    if (!products) {
      return res.status(401).json({
        success: false,
        message: 'Products Not Found'
      });
    }

    const ratingData = products
      .map((product) => {
        let rating: number = 0;

        if (product.reviews.length !== 0) {
          product.reviews.forEach((review: { rating: number }) => {
            rating += review.rating;
          });

          rating = rating / product.reviews.length;
        }

        return {
          name: product.name,
          id: product._id,
          rating: Math.floor(rating * 10) / 10
        };
      })
      .sort((a, b) => {
        return b.rating - a.rating;
      });

    res.status(200).json({
      success: true,
      data: ratingData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  const mandatoryFields = ['name', 'price', 'images', 'category'];
  const validate = (f: string) => req.body[f];
  const isValid = mandatoryFields.every(validate);
  if (!isValid) {
    return res.status(404).json({
      succcess: false,
      message: 'You need to include name, price, images and category'
    });
  }

  try {
    const category = await Category.findById(req.body.category);

    if (!category) {
      return res.status(404).json({
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

  const u_id = (req as any).adminId;

  if (!validateAuth(u_id)) {
    return res.status(401).json({
      succcess: false,
      message: 'You are not authorized',
      auth: true
    });
  }

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
      product: product,
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
    const product = await Product.findOne({ _id: req.params.id }).populate('category').populate('reviews');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product Not Found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

export const updateProductById = async (req: Request, res: Response) => {
  const id = req.params.id;

  const u_id = (req as any).adminId;

  if (!validateAuth(u_id)) {
    return res.status(401).json({
      succcess: false,
      message: 'You are not authorized',
      auth: true
    });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(400).json({
        success: false,
        message: 'Product Not Found'
      });
    }

    Product.findByIdAndUpdate(id, req.body, { new: true }, function (err, updated) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      res.status(200).json({
        success: true,
        product: updated
      });
    });
  } catch (error) {}
};
