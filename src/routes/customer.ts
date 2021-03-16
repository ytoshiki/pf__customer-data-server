import express from 'express';
import { createCustomer, deleteCustomerById, getAllCustomers, getCustomerById, getCustomersByAge, getCustomersByGender, getCustomersByNat, getCustomersByRegisterYear, getCustomesHavePurchased, updateCustomerById } from '../controllers';

const router = express.Router();

// api/customers/
// POST: Set a new customer
// GET: Get all customers
router.route('/').get(getAllCustomers).post(createCustomer);

// api/customers/purchased
router.route('/purchased').get(getCustomesHavePurchased);

// api/customers/registered/:year
router.route('/registered/:year').get(getCustomersByRegisterYear);

// api/customers/category/gender/:gender
// GET: Get customers matched
router.route('/category/gender/:gender').get(getCustomersByGender);

// api/customers/category/age/:age
// GET: Get customers matched
router.route('/category/age/:age').get(getCustomersByAge);

// api/customers/category/nat/:nat
// GET: Get customers matched
router.route('/category/nat/:nat').get(getCustomersByNat);

// api/customers/:id
// GET: Get customer by Id
// DELETE: Delete customer by id
// PATCH: Update user by id
router.route('/:id').get(getCustomerById).delete(deleteCustomerById).patch(updateCustomerById);

export default router;
