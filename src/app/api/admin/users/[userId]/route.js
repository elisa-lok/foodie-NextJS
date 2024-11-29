import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import User from "@/app/models/User";
import Admin from "@/app/models/Admin";
import jwt from "jsonwebtoken";

export async function PUT(req, { params }) {
  try {
    const { status } = await req.json();
    if (!status) {
      return NextResponse.json({ status: 400, error: "Status is required." });
    }

    const { userId } = params;
    if (!userId) {
      return NextResponse.json({ status: 400, error: "User ID is required." });
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

    const result = await User.updateOne({ _id: userId }, { status: status });

    if (!result) {
      return NextResponse.json({
        status: 400,
        error: "failed to update user status",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Update user status successfully",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: error.message || "Internal Server Error",
    });
  }
}
