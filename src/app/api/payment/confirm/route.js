import dbConnect from '@/utils/db';
import { NextResponse } from 'next/server';
import Order from '@/app/models/Order';
import jwt from 'jsonwebtoken';
//import axios from 'axios';

export async function POST(req) {
  await dbConnect();
  try {
    const { transactionId } = await req.json();
    if (!transactionId) {
      return NextResponse.json({
        status: 400,
        error: 'Transaction ID is required'
      })
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { status: 401, error: "Authorization token is missing." }
      );
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // const response = await axios.get(
  //   `${process.env.POLI_API_URL}/api/v2/Transaction/${transactionId}`,
  //   {
  //     headers: {
  //       Authorization: `Basic ${Buffer.from(`${process.env.POLI_API_KEY}:${process.env.POLI_API_SECRET}`).toString("base64")}`,
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );
    
    //   const paymentStatus = response.data.status;
    
    const paymentStatus = 'success';

    if (paymentStatus !== 'success') {
      return NextResponse.json({ status: 400, error: 'Payment confirmation failed' });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { userId: decoded.userId, transactionId: transactionId }, 
      { paymentStatus: 1, paymentMethod: 1, orderStatus: 1 }, 
      { new: true } 
    );

    if (!updatedOrder) {
      return NextResponse.json({ status: 400, error: 'Order paymentStatus failed updated' });
    }

    const orderId = updatedOrder._id;

    return NextResponse.json({ status: 200, orderId: orderId});
  } catch (error) {
    //return NextResponse.json({ status: 500, error: error.message || "Internal Server Error" });
    return NextResponse.json({ status: 500, error: "Internal Server Error" });
  }
}
