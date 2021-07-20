import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Customer } from '../models/customer';
import { Product } from '../models/product';
import { Purchase } from '../models/purchase';

export const logAllPurchases = async (req: Request, res: Response) => {
  try {
    const purchases = await Purchase.find({}).populate('product').populate('customer');
    if (!purchases.length) {
      return res.status(404).json({
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

export const logPurchasesByCustomerId = async (req: Request, res: Response) => {
  try {
    const c_id = req.params.c_id;

    // customer: mongoose.Types.ObjectId(c_id)

    const purchases = await Purchase.find({
      customer: mongoose.Types.ObjectId(c_id)
    }).populate('product');

    if (!purchases.length) {
      return res.status(404).json({
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

export const logPurchasesByTerm = async (req: Request, res: Response) => {
  try {
    const term = req.params.term;

    const now = new Date();
    let date;
    let startDate;
    let endDate;
    let dateError;

    if (term === 'week') {
      date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0);
    } else if (term === 'month') {
      date = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    } else if (term === 'year') {
      date = new Date(now.getFullYear() - 1, now.getMonth(), 1, 0, 0, 0);
    } else if (term.split('-').length === 2) {
      const termArr = term.split('-');
      const year: number = Number(termArr[0]);
      const month: number = Number(termArr[1]);

      if (String(year).length !== 4) {
        dateError = 'Not Valid Year';
      } else if (String(month).length > 2) {
        dateError = 'Not Valid Month';
      }

      startDate = new Date(year, month - 1, 1, 0, 0, 0);
      endDate = new Date(year, month, 1);
    } else {
    }

    let options: any = {
      $gt: date
    };

    if (startDate && endDate) {
      options = {
        $gt: startDate,
        $lt: endDate
      };
    }

    const purchases = await Purchase.find({
      createdAt: options
    })
      .populate('product')
      .populate('customer');

    if (!purchases.length) {
      return res.status(404).json({
        success: false,
        message: 'Purchases Not Found'
      });
    }

    res.status(200).json({
      success: true,
      number: purchases.length,
      purchases,
      options
    });
  } catch (error) {}
};

export const logPurchase = async (req: Request, res: Response) => {
  try {
    const c_id = req.params.c_id;
    const p_id = req.params.p_id;

    // customer: mongoose.Types.ObjectId(c_id)

    const purchase = await Purchase.findOne({
      product: mongoose.Types.ObjectId(p_id),
      customer: mongoose.Types.ObjectId(c_id)
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase Not Found'
      });
    }

    res.status(200).json({
      success: true,
      purchase
    });
  } catch (error) {}
};

export const createPurchase = async (req: Request, res: Response) => {
  if (!req.body.product || !req.body.customer) {
    return res.status(404).json({
      success: false,
      message: 'You need to include product and customer'
    });
  }

  try {
    const product = await Product.findOne({ _id: req.body.product });

    if (!product) {
      return res.status(400).json({
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
    ).populate('purchasedItems');

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

export const getAnnuallData = async (req: Request, res: Response) => {
  try {
    const purchases = await Purchase.find({}).populate('product').populate('customer');

    if (!purchases.length) {
      return res.status(404).json({
        success: false,
        message: 'Purchases Not Found'
      });
    }

    let data: { date: string; profit: number }[] = [];
    const dateArray: string[] = [];

    const current = new Date();
    const sample = new Date(current.getFullYear(), current.getMonth() + 2, 1, 0, 0, 0);

    for (let i = 0; i < 12; i++) {
      const target = new Date(sample.setMonth(sample.getMonth() - 1));

      let month;
      let year;

      if (target.getMonth() === 0) {
        month = 12;
        year = target.getFullYear() - 1;
      } else {
        month = target.getMonth();
        year = target.getFullYear();
      }

      dateArray.push(`${year}-${month}`);
    }

    dateArray.forEach((date) => {
      const newObj = {
        date,
        profit: 0
      };

      data.push(newObj);
    });

    const validPurchases = purchases.filter((purchase: any) => purchase.product !== null);

    validPurchases.forEach((purchase: any) => {
      const date = new Date(purchase.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth();

      const label = `${year}-${month + 1}`;

      data.map((obj) => {
        if (obj.date === label) {
          obj.profit += purchase.product.price;
        }

        return obj;
      });
    });

    res.status(200).json({
      success: true,
      data: data.reverse()
    });
  } catch (error) {}
};

export const countItemPurchase = async (req: Request, res: Response) => {
  try {
    const productId = req.params.p_id;

    const purchases = await Purchase.find({
      product: productId
    }).populate('customer');

    if (!purchases.length) {
      return res.status(404).json({
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
