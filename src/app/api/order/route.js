import dbConnect from '@/utils/db';
import jwt from 'jsonwebtoken';
import Order from '@/app/models/Order';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await dbConnect();

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { status: 401, error: "Authorization token is missing." }
      );
    }

    const token = authHeader.split(' ')[1]; // Bearer token
    if (!token) {
      return NextResponse.json(
        { status: 401, error: "Token is missing." }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const decodedUserId = decoded.userId;
    const { name, phone, email, address, instructions, cartItems, totalPrice, pickupMethod, userId } = await req.json();
    
    if (decodedUserId !== userId) {
      return NextResponse.json(
        { status: 401, error: "User ID mismatch." }
      );
    }
   
    const newOrder = new Order({
      userId,                       
      name,           
      phone,                     
      email,                   
      address,                     
      instructions,                
      cartItems,             
      totalPrice,                   
      pickupMethod,
    });

    await newOrder.save();

    return NextResponse.json(
      {
        status: 200,
        message: "Order created successfully",
        orderId: newOrder._id, 
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        error: error.message || "Internal Server Error",
      }
    )
  }
}