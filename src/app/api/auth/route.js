import jwt from 'jsonwebtoken';
import dbConnect from '@/utils/db';
import User from '@/app/models/User';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ status: 401, message: "Authorization token is missing or invalid" });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await dbConnect();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ status: 404, message: "User not found" });
    }

    return NextResponse.json({ status: 200, user: { id: user._id, email: user.email } });

  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json({ status: 500, message: "Internal server error" });
  }
}
