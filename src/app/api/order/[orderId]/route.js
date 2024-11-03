import dbConnect from '@/utils/db';
//import jwt from 'jsonwebtoken';
import Order from '@/app/models/Order';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { orderId } = params;
  if (!orderId) {
    return NextResponse.json(
      {
        status: 400,
        error: "Order ID is missing",
      }
    )
  }
  
  await dbConnect();
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        {
          status: 404,
          error: "Order not found",
        }
      )
    }

    return NextResponse.json(
      {
        status: 200,
        order: order,
      }
    )
  }catch (error) {
    return NextResponse.json(
      {
        status: 500,
        error: error.message || "Internal Server Error",
      }
    )
  }
}