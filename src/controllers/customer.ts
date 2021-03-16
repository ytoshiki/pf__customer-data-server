import { Request, Response } from 'express';
import { Customer } from '../models/customer';
import { generateCustomers } from '../helper';

// One Time Only
// This sets default customers manually
export const setCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await generateCustomers();

    const newCustomers = await Customer.insertMany(customers as any);

    res.status(200).json({
      success: true,
      newCustomers
    });
  } catch (error) {}
};

//
//
// GET REQUESTS
//
//

export const getAllCustomers = async (req: Request, res: Response) => {
  // res.send('get all customers');
  try {
    const customers = await Customer.find({});
    if (!customers)
      return res.status(401).json({
        success: false,
        message: 'Customers Not Found'
      });

    res.status(200).json({
      success: true,
      customers
    });
  } catch (error) {}
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const customer = await Customer.findOne({ _id: id }).populate('purchasedItems');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer Not Found'
      });
    }

    res.status(200).json({
      success: true,
      customer
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Customer Not Found'
    });
  }
};

export const getCustomersByGender = async (req: Request, res: Response) => {
  const gender = req.params.gender;

  try {
    const customers = await Customer.find({ gender });
    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Invalid gender'
      });
    }

    res.status(200).json({
      success: true,
      customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getCustomersByAge = async (req: Request, res: Response) => {
  const ageParam = req.params.age;

  try {
    let customers;

    if (ageParam === '<20') {
      customers = await Customer.find({ age: { $lt: 20 } });
    } else if (ageParam === '20-29') {
      customers = await Customer.find({
        age: {
          $gt: 19,
          $lt: 30
        }
      });
    } else if (ageParam === '30-39') {
      customers = await Customer.find({
        age: {
          $gt: 29,
          $lt: 40
        }
      });
    } else if (ageParam === '>40') {
      customers = await Customer.find({
        age: {
          $gt: 39
        }
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Invalid Age'
      });
    }

    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Invalid age'
      });
    }

    res.status(200).json({
      success: true,
      customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getCustomersByNat = async (req: Request, res: Response) => {
  const nat = req.params.nat;

  const validCountries = ['GB', 'FR', 'DK', 'NO', 'NL', 'US', 'NZ', 'FI', 'ES', 'CA', 'BR', 'AU', 'JP'];
  const validData = validCountries.includes(nat);

  if (!validData)
    res.status(400).json({
      success: false,
      message: 'Invalid nationality'
    });

  try {
    const customers = await Customer.find({ nat });
    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Invalid nationality'
      });
    }

    res.status(200).json({
      success: true,
      customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Returns Customers Who have purchased products
// () => _id, purchasesItems, username
export const getCustomesHavePurchased = async (req: Request, res: Response) => {
  try {
    const customers = await Customer.find({
      purchasedItems: {
        $exists: true,
        $not: { $size: 0 }
      }
    })
      .populate('purchasedItems')
      .select('_id username purchasedItems');
    // .populate('purchasedItems');

    if (!customers) {
      return res.status(401).json({
        success: false,
        message: 'Customers Not Found'
      });
    }

    const sortedCustomers = customers
      .map((customer) => {
        return {
          id: customer._id,
          username: customer.username,
          totalPurchases: Math.floor(customer.purchasedItems.reduce((acc, obj) => acc + obj.price, 0) * 100) / 100
        };
      })
      .sort((cus1, cus2) => cus2.totalPurchases - cus1.totalPurchases);

    res.status(201).json({
      success: true,
      customers: sortedCustomers
    });
  } catch (error) {}
};

export const getCustomersByRegisterYear = async (req: Request, res: Response) => {
  const year: number = Number(req.params.year);

  if (year > 10) {
    return res.status(400).json({
      success: false,
      message: 'Invalid year'
    });
  }

  // Start Date

  let startDate = new Date('2020-01-01').setFullYear(new Date().getFullYear() - year);

  // End Date

  const endDate = new Date('2020-01-01').setFullYear(new Date().getFullYear() - year + 1);

  try {
    const customers = await Customer.find({
      dateRegistered: {
        $gt: new Date(startDate),
        $lt: new Date(endDate)
      }
    });

    if (!customers) {
      return res.status(401).json({
        success: false,
        message: 'Customers Not Found'
      });
    }

    const number = customers.length;

    res.status(200).json({
      success: true,
      number,
      customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//
//
// POST REQUESTS
//
//
export const createCustomer = async (req: Request, res: Response) => {
  const isFilled = (f: string) => req.body[f];
  const mandatoryFields = ['username', 'email', 'nat', 'age', 'gender'];
  const validData = mandatoryFields.every(isFilled);

  if (!validData)
    res.status(400).json({
      success: false,
      message: 'Missing some mandatory fields'
    });

  try {
    const user = new Customer(req.body);

    user.dateRegistered = new Date();
    const newUser = await user.save();

    res.status(201).json({
      success: true,
      newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//
//
// UPDATE REQUTESTS
//
//

export const updateCustomerById = async (req: Request, res: Response) => {
  const validFields = ['username', 'email', 'avator'];
  const reqBody = req.body;

  const validate = (f: string) => validFields.includes(f);
  const validRequest = Object.keys(reqBody).every(validate);

  if (!validRequest) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Fields Provided'
    });
  }

  try {
    const updatedUser = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({
      success: true,
      updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//
//
// DELETE REQUESTS
//
//

export const deleteCustomerById = async (req: Request, res: Response) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Customer deleted Successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
