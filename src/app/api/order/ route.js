import dbConnect from '@/utils/db';
import { NextResponse } from 'next/server';
import Order from '@/app/models/Order';

export async function POST(req) {
  try {
    await dbConnect();
    const { name, phone, email, address, instructions, cartItems, totalPrice, pickupMethod, userId } = await req.json();
   
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
        error: "Failed to visit",
      }
    )
  }
}