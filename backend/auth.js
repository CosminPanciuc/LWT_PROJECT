import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const { verify, sign } = jwt;

const {hash, compare} = bcrypt;

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

export const generateToken = (userId) => {
  return sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const getUserFromToken = (token) => {
  try {
    if (!token) return null;
    const cleanToken = token.replace('Bearer ', '');
    const decoded = verify(cleanToken, JWT_SECRET);
    return decoded.userId;
  } catch (err) {
    return null;
  }
};

export const hashPassword = async (password) => {
  return await hash(password, 10);
};

export const comparePassword = async (password, hashedPassword) => {
  return await compare(password, hashedPassword);
};
