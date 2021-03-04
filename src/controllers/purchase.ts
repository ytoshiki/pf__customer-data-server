import { Request, Response } from 'express';
import { Customer } from '../models/customer';
import { Product } from '../models/product';
import { Purchase } from '../models/purchase';

export const logAllPurchases = async (req: Request, res: Response) => {
  try {
    const purchases = await Purchase.find({}).populate('product').populate('customer');
    if (!purchases.length) {
      return res.status(401).json({
        success: false,
        message: 'Purchases Not Found'
      });
    }

    res.status(200).json({
      success: true,
      purchases
    });
  } catch (error) {}
};

export const createPurchase = async (req: Request, res: Response) => {
  if (!req.body.product || !req.body.customer) {
    return res.status(401).json({
      success: false,
      message: 'You need to include product and customer'
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

    const purchase = new Purchase(req.body);

    const newPurchase = await purchase.save();

    if (!newPurchase) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong'
      });
    }

    const customer = await Customer.findByIdAndUpdate(
      req.body.customer,
      {
        $push: {
          purchasedItems: product._id
        }
      },
      { new: true }
    );

    if (!customer) {
      res.status(500).json({
        success: false,
        message: 'Failed to add purchased items in customer model'
      });
    }

    res.status(200).json({
      success: true,
      newPurchase,
      customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
