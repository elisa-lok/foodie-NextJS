import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Admin from "@/app/models/Admin";
import User from "@/app/models/User";
import Order from "@/app/models/Order";
import Meals from "@/app/models/Meals";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
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

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    const recentProducts = await Meals.find().sort({ createdAt: -1 }).limit(5);

    return NextResponse.json({
      status: 200,
      data: {
        recentUsers,
        recentOrders,
        recentProducts,
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: error.message || "Internal Server Error",
    });
  }
}
