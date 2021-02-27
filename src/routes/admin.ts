import express, { Request } from 'express';
import { createAdmin, signInAdmin } from '../controllers';
import { authenticateToken } from '../middleware';
const router = express.Router();

// TEST
router.route('/test').get(authenticateToken, (req, res) => {
  res.send({
    id: (req as any).userId
  });
});

// POST: Create Admin
router.route('/register').post(createAdmin);

// POST: Log In
router.route('/login').post(signInAdmin);

// Post: Log out

// Post: Delete Admin

export default router;
