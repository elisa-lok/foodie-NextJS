import dbConnect from '@/utils/db';
import jwt from 'jsonwebtoken';
import User from '@/app/models/User';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
      return NextResponse.json({
        status: 400,
        error: 'Token is required for account activation.',
      });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    await dbConnect();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({
        status: 404,
        message: 'Invalid activation link.'
      })
    }

    user.status = 'active';
    await user.save();

    return NextResponse.json({
      status: 200,
      message: 'Account activated successfully.'
    })

  } catch (error) {
    console.error('Activation error:', error);
    return NextResponse.json({
      status: 500,
      message: 'Failed to activate account.'
    })
  }
}