import connectMongo from "../../utils/db.js";
//import mongoose from "mongoose";
import Meals from "../models/Meals.js";
import { NextResponse } from 'next/server.js';

export async function GET(req, res) {
  await connectMongo();
  const meals = await Meals.find({});
  console.log("1111");
  console.log(NextResponse.json(
    meals
  ));
  console.log("12222");
}
