import { NextResponse } from "next/server";
import dbConnect from '@/utils/db';
import User from "@/app/models/User";
import Admin from "@/app/models/Admin";
import jwt from 'jsonwebtoken';

export async function GET( req ) {

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

    const admin = await Admin.findOne({ _id: decoded.userId});
    if (!admin) {
      return NextResponse.json({ status: 404, error: "Admin not found" });
    }

    const users = await User.find();

    if (!users || users.length === 0) {
      return NextResponse.json(
        { status: 404, error: "No users found."}
      );
    }

    return NextResponse.json({ status: 200, users: users });
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        error: error.message || "Internal Server Error",
      }
    );
  }
}
