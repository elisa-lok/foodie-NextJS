import dbConnect from '@/utils/db';
//import jwt from 'jsonwebtoken';
import Order from '@/app/models/Order';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url); 
  const transactionId = searchParams.get('transactionId');

  if (!transactionId) {
    return NextResponse.json(
      {
        status: 400,
        error: "transactionId is missing",
      }
    )
  }
  
  await dbConnect();
  try {
    const order = await Order.findOne({transactionId: transactionId});
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