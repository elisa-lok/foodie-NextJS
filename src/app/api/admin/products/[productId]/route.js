import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Meals from "@/app/models/Meals";
import Admin from "@/app/models/Admin";
import jwt from "jsonwebtoken";

export async function PUT(req, { params }) {
  try {
    const { productId } = params;
    if (!productId) {
      return NextResponse.json({
        status: 400,
        error: "Product ID is required.",
      });
    }

    //const { id, name, price, description, image } = await req.json();

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

    const products = await Meals.find();

    if (!products || products.length === 0) {
      return NextResponse.json({ status: 404, error: "No product found." });
    }

    return NextResponse.json({ status: 200, products: products });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: error.message || "Internal Server Error",
    });
  }
}
