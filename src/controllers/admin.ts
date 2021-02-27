import { Admin } from '../models/admin';
import { generateAccessToken } from '../helper';
import { Request, Response } from 'express';

// Interfaces
export interface SignIn {
  name: string;
  password: string;
}

// Controllers
export const createAdmin = async (req: Request, res: Response) => {
  const admin = new Admin(req.body);
  try {
    const newAdmin = await admin.save();

    // Create Token
    const token = generateAccessToken({ id: newAdmin._id.toString() });

    res.status(201).json({
      success: true,
      token,
      admin: newAdmin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const signInAdmin = async (req: Request, res: Response) => {
  const input: SignIn = req.body;
  if (!input.name || !input.password || input.password.length < 6) {
    res.set(400).json({
      success: false,
      message: 'Empty field is not allowed'
    });
  }
  try {
    const admin = await Admin.findOne({ name: input.name });

    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Admin Not Found'
      });
    }

    if (admin) {
      // verify password
      if (!admin.verifyPassword(input.password)) {
        res.status(401).json({
          success: false,
          message: "Uame and password don't match"
        });
      }

      // create token
      const token = generateAccessToken({ id: admin._id.toString() });

      res.status(200).json({
        success: true,
        token,
        admin
      });
    }
    // if (user && user.VerifyPassword(input.password)) {

    // }
  } catch (error) {}
};
