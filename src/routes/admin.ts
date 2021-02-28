import express, { Request } from 'express';
import { createAdmin, deleteAdmin, logoutAdmin, signInAdmin } from '../controllers';
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
router.route('/logout').post(authenticateToken, logoutAdmin);

// Post: Delete Admin
router.route('/delete').post(authenticateToken, deleteAdmin);

export default router;
