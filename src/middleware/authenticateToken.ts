import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null)
    return res.status(401).json({
      success: false,
      message: 'Token Not Found'
    });

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) return res.status(400).json({ success: false, message: err.message });

    if (decoded) {
      (req as any).adminId = (decoded as { id: string }).id;
    }
  });

  next();
};
