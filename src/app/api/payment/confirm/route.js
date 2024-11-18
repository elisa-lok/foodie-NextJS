import dbConnect from '@/utils/db';
import { NextResponse } from 'next/server';
import Order from '@/app/models/Order';
//import axios from 'axios';

export async function POST(request) {
  await dbConnect();
  try {
    const { transactionId } = await request.json();

    if (!transactionId) {
      return NextResponse.json({
        status: 400,
        error: 'Transaction ID is required'
      })
    }

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
      { transactionId: transactionId }, 
      { paymentStatus: 1, paymentMethod: 2 }, 
      { new: true } 
    );

    if (!updatedOrder) {
      return NextResponse.json({ status: 400, error: 'Order paymentStatus failed updated' });
    }

    const orderId = updatedOrder._id;

    return NextResponse.json({ status: 200, message: 'Payment confirmed', orderId: orderId});
  } catch (error) {
    return NextResponse.json({ status: 500, error: "Internal Server Error" });
  }
}
