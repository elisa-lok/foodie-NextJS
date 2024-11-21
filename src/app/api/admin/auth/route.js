import jwt from 'jsonwebtoken';
import dbConnect from '@/utils/db';
import Admin from '@/app/models/Admin';
import { NextResponse } from 'next/server';
export const dynamic = "force-dynamic";
export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ status: 401, message: "Authorization token is missing or invalid" });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await dbConnect();

    const admin = await Admin.findOne({ _id: decoded.userId});
    if (!admin) {
      return NextResponse.json({ status: 404, message: "Admin not found" });
    }

    return NextResponse.json({ status: 200, user: { id: admin._id, email: admin.email } });

  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json({ status: 500, message: "Internal server error" });
  }
}
