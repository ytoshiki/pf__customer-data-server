import express from 'express';
import { createCustomer, deleteCustomerById, getAllCustomers, getCustomerById, getCustomerByName, getCustomersByAge, getCustomersByGender, getCustomersByNat, getCustomersByPage, getCustomersByRegisterYear, getCustomesHavePurchased, getNewlyRegisteredCustomers, updateCustomerById } from '../controllers';

const router = express.Router();

// api/customers/
// POST: Set a new customer
// GET: Get all customers
router.route('/').get(getAllCustomers).post(createCustomer);

// api/customers/purchased
router.route('/purchased').get(getCustomesHavePurchased);

router.route('/new').get(getNewlyRegisteredCustomers);

router.route('/name/:name').get(getCustomerByName);

// api/customers/registered/:year
router.route('/registered/:year').get(getCustomersByRegisterYear);

router.route('/page/:page/:sort/:by').get(getCustomersByPage);

// api/customers/category/gender/:gender
// GET: Get customers matched
router.route('/gender/:gender/:page/:sort/:by').get(getCustomersByGender);

// api/customers/category/age/:age
// GET: Get customers matched
router.route('/age/:age/:page/:sort/:by').get(getCustomersByAge);

// api/customers/category/age/:age
// GET: Get customers matched
router.route('/nat/:nat/:page/:sort/:by').get(getCustomersByNat);

// // api/customers/category/nat/:nat
// // GET: Get customers matched
// router.route('/category/nat/:nat').get(getCustomersByNat);

// api/customers/:id
// GET: Get customer by Id
// DELETE: Delete customer by id
// PATCH: Update user by id
router.route('/:id').get(getCustomerById).delete(deleteCustomerById).patch(updateCustomerById);

export default router;
