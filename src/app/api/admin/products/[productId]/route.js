import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Meals from "@/app/models/Meals";
import Admin from "@/app/models/Admin";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function PUT(req, { params }) {
  try {
    const { productId } = params;
    if (!productId) {
      return NextResponse.json({
        status: 400,
        error: "Product ID is required.",
      });
    }

    const { name, price, description, image } = await req.json();

    if (!name || !price || !description || !image) {
      return NextResponse.json({
        status: 400,
        error: "Please checked the required fields.",
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

    const meal = await Meals.findOne({ _id: productId });
    if (!meal) {
      return NextResponse.json({ status: 404, error: "No meal found." });
    }

    if (image && image.startsWith("data:image/")) {
      const imageOldPath = path.join(process.cwd(), "public", meal.image);
      if (imageOldPath) {
        fs.unlinkSync(imageOldPath);
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
      meal.image = imageUrl;
    }

    meal.name = name;
    meal.price = price;
    meal.description = description;
    meal.updatedAt = new Date();

    await meal.save();

    return NextResponse.json({
      status: 200,
      message: "Product updated successfully",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: error.message || "Internal Server Error",
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { productId } = params;
    if (!productId) {
      return NextResponse.json({
        status: 400,
        error: "Product ID is required.",
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

    const meal = await Meals.findOne({ _id: productId });
    if (!meal) {
      return NextResponse.json({ status: 404, error: "No product found." });
    }

    if (meal.image) {
      const imagesPath = path.join(process.cwd(), "public", meal.image);
      if (imagesPath) {
        fs.unlinkSync(imagesPath);
      }
    }

    await meal.deleteOne();

    return NextResponse.json({
      status: 200,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: error.message || "Internal Server Error",
    });
  }
}
