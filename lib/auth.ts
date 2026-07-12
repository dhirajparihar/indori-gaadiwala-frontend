import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from './dbConnect';
import User from './models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'gaadiwala-secret-key-2026-change-this-in-production';

export interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

export async function verifyAuth(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    await dbConnect();
    const user = await User.findById(decoded.id).select('-password');
    return user || null;
  } catch (error) {
    return null;
  }
}
