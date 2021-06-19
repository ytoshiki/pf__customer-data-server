import { Request, Response } from 'express';
import { Customer } from '../models/customer';
import { generateAccessToken, generateCustomers } from '../helper';

interface SignIn {
  username: string;
  password: string;
}

// *****Never Use It******
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

export const getCustomerByName = async (req: Request, res: Response) => {
  const username = req.params.name;

  try {
    const customer = await Customer.findOne({
      username
    });

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
  } catch (error) {}
};

export const getCustomersByGender = async (req: Request, res: Response) => {
  const gender = req.params.gender;

  try {
    let sort = {};
    let by = -1;

    if (req.params.by === 'desc') {
      by = 1;
    }

    if (req.params.sort === 'name') {
      sort = {
        username: by
      };
    } else if (req.params.sort === 'date') {
      sort = {
        dateRegistered: by
      };
    }

    let start = 1;
    let end = 20;

    let page = Number(req.params.page);

    start = (page - 1) * end;

    const customers = await Customer.find({ gender }).sort(sort);

    const paginatedItems = customers.slice(start).slice(0, end);

    const totalPages = Math.ceil(customers.length / 20);

    res.status(200).json({
      success: true,
      page,
      pre_page: page - 1 ? page - 1 : null,
      next_page: totalPages > page ? page + 1 : null,
      total_page: totalPages,
      per_page: end,
      total: customers.length,
      data: paginatedItems
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
    let sort = {};
    let by = -1;

    if (req.params.by === 'desc') {
      by = 1;
    }

    if (req.params.sort === 'name') {
      sort = {
        username: by
      };
    } else if (req.params.sort === 'date') {
      sort = {
        dateRegistered: by
      };
    }

    let start = 1;
    let end = 20;

    let page = Number(req.params.page);

    start = (page - 1) * end;

    let customers;

    if (ageParam === '<20') {
      customers = await Customer.find({ age: { $lt: 20 } }).sort(sort);
    } else if (ageParam === '20-29') {
      customers = await Customer.find({
        age: {
          $gt: 19,
          $lt: 30
        }
      }).sort(sort);
    } else if (ageParam === '30-39') {
      customers = await Customer.find({
        age: {
          $gt: 29,
          $lt: 40
        }
      }).sort(sort);
    } else if (ageParam === '>40') {
      customers = await Customer.find({
        age: {
          $gt: 39
        }
      }).sort(sort);
    } else {
      return res.status(404).json({
        success: false,
        message: 'Invalid Age'
      });
    }

    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customers Not Found'
      });
    }

    const paginatedItems = customers.slice(start).slice(0, end);

    const totalPages = Math.ceil(customers.length / 20);

    res.status(200).json({
      success: true,
      page,
      pre_page: page - 1 ? page - 1 : null,
      next_page: totalPages > page ? page + 1 : null,
      total_page: totalPages,
      per_page: end,
      total: customers.length,
      data: paginatedItems
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

  let sort = {};
  let by = -1;

  if (req.params.by === 'desc') {
    by = 1;
  }

  if (req.params.sort === 'name') {
    sort = {
      username: by
    };
  } else if (req.params.sort === 'date') {
    sort = {
      dateRegistered: by
    };
  }

  let start = 1;
  let end = 20;

  let page = Number(req.params.page);

  start = (page - 1) * end;

  try {
    const customers = await Customer.find({ nat }).sort(sort);

    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Invalid nationality'
      });
    }

    const paginatedItems = customers.slice(start).slice(0, end);

    const totalPages = Math.ceil(customers.length / 20);

    res.status(200).json({
      success: true,
      page,
      pre_page: page - 1 ? page - 1 : null,
      next_page: totalPages > page ? page + 1 : null,
      total_page: totalPages,
      per_page: end,
      total: customers.length,
      data: paginatedItems
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

export const getNewlyRegisteredCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await Customer.find({});

    const now = new Date();

    const date = new Date(now.getFullYear(), now.getMonth(), 1, 1, 0, 0, 0);

    const newlyRegistered = customers.filter((customer) => {
      const registered = new Date(customer.dateRegistered);
      return registered > new Date(date);
    });

    res.status(200).json({
      success: true,
      data: newlyRegistered
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getCustomersByPage = async (req: Request, res: Response) => {
  try {
    let sort = {};
    let by = -1;

    if (req.params.by === 'desc') {
      by = 1;
    }

    if (req.params.sort === 'name') {
      sort = {
        username: by
      };
    } else if (req.params.sort === 'date') {
      sort = {
        dateRegistered: by
      };
    }

    let start = 1;
    let end = 20;

    let page = Number(req.params.page);

    start = (page - 1) * end;

    const customers = await Customer.find({}).sort(sort);

    const paginatedItems = customers.slice(start).slice(0, end);

    const totalPages = Math.ceil(customers.length / 20);

    res.status(200).json({
      success: true,
      page,
      pre_page: page - 1 ? page - 1 : null,
      next_page: totalPages > page ? page + 1 : null,
      total_page: totalPages,
      per_page: end,
      total: customers.length,
      data: paginatedItems
    });
  } catch (error) {
    res.status(400).json({
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
  const mandatoryFields = ['username', 'email', 'nat', 'age', 'gender', 'password'];
  const validData = mandatoryFields.every(isFilled);

  if (!validData)
    return res.status(404).json({
      success: false,
      message: 'Missing some mandatory fields'
    });

  try {
    const userExist = await Customer.findOne({
      username: req.body.username
    });

    if (userExist) {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken'
      });
    }

    const user = new Customer(req.body);

    user.dateRegistered = new Date();
    const newUser = await user.save();

    const token = generateAccessToken({ id: newUser._id.toString() });

    res.status(201).json({
      success: true,
      newUser,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const signInCustomer = async (req: Request, res: Response) => {
  const input: SignIn = req.body;
  if (!input.username || !input.password || input.password.length < 6) {
    return res.set(404).json({
      success: false,
      message: 'Empty field is not allowed'
    });
  }
  try {
    const customer = await Customer.findOne({ username: input.username }).populate('purchasedItems');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer Not Found'
      });
    }

    if (customer) {
      // verify password
      if (!(customer as any).verifyPassword(input.password)) {
        return res.status(401).json({
          success: false,
          message: "Username and password don't match"
        });
      }

      // create token
      const token = generateAccessToken({ id: customer._id.toString() });

      res.status(200).json({
        success: true,
        token,
        customer
      });
    }
    // if (user && user.VerifyPassword(input.password)) {

    // }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Username and password don't match"
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
