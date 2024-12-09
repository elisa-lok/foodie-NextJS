import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Admin from "@/app/models/Admin";
import User from "@/app/models/User";
import Order from "@/app/models/Order";
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

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const ordersThisMonth = await Order.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const revenueThisMonth = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    return NextResponse.json({
      status: 200,
      data: {
        ordersThisMonth,
        revenueThisMonth: `$${revenueThisMonth[0]?.total || 0}`,
        newUsersThisMonth,
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: error.message || "Internal Server Error",
    });
  }
}
