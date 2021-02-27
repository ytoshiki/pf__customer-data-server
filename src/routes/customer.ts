import express from 'express';
import { setCustomers, getAllCustomers } from '../controllers';

const router = express.Router();

// api/customers/
// create, read

// api/customers/:id
// update, delete, read

router.route('/').get(getAllCustomers).post(setCustomers);

export default router;
