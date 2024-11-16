import { NextResponse } from "next/server";
import dbConnect from '@/utils/db';
import Order from "@/models/Order";
import User from "@/models/User";
import jwt from 'jsonwebtoken';

export async function GET(req, { params }) {
  const { userId } = params;

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { status: 401, error: "Authorization token is missing." }
      );
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await dbConnect();

    const user = await User.findOne({ _id: decoded.userId, status: "active" });
    if (!user) {
      return NextResponse.json({ status: 404, error: "User not found or not active" });
    }

    const orders = await Order.find({ userId });

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { status: 404, error: "No orders found for this user."}
      );
    }

    return NextResponse.json({ status: 200, orders: orders });
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        error: error.message || "Internal Server Error",
      }
    );
  }
}
