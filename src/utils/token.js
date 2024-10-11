import jwt from 'jsonwebtoken';

export const createActivationLink = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
  return `${process.env.BASE_URL}/activate?token=${token}`;
}            