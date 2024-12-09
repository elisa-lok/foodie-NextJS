import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Meals from "@/app/models/Meals";
import Admin from "@/app/models/Admin";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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

    const products = await Meals.find().sort({ createdAt: -1 });

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

export async function POST(req) {
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

    const { name, price, description, image } = await req.json();

    if (!name || !price || !description || !image) {
      return NextResponse.json({
        status: 400,
        error: "Please checked the required fields.",
      });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const imageFilename = `${uuidv4()}.png`;
    const imagePath = path.join(
      process.cwd(),
      "public",
      "images",
      imageFilename
    );

    fs.writeFileSync(imagePath, buffer);

    const imageUrl = `images/${imageFilename}`;

    const newProduct = new Meals({
      name,
      price,
      description,
      image: imageUrl,
      createdAt: new Date(),
      updatedAt: "",
    });

    await newProduct.save();

    return NextResponse.json({
      status: 200,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: error.message || "Internal Server Error",
    });
  }
}
