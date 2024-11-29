import dbConnect from "@/utils/db";
import jwt from "jsonwebtoken";
import Order from "@/app/models/Order";
import Admin from "@/app/models/Admin";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { orderId } = params;
  if (!orderId) {
    return NextResponse.json({
      status: 400,
      error: "Order ID is missing",
    });
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({
      status: 401,
      error: "Authorization token is missing.",
    });
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  await dbConnect();

  const admin = await Admin.findOne({ _id: decoded.userId });
  if (!admin) {
    return NextResponse.json({ status: 404, error: "Admin not found" });
  }

  await dbConnect();
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({
        status: 404,
        error: "Order not found",
      });
    }

    return NextResponse.json({
      status: 200,
      order: order,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: error.message || "Internal Server Error",
    });
  }
}
