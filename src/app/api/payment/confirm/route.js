import dbConnect from "@/utils/dbConnect";
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  await dbConnect();
  try {
    const { transactionId } = await request.json();

    if (!transactionId) {
      return NextResponse.json({
        status: 400,
        message: 'Transaction ID is required'
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
      return NextResponse.json({ status: 400, message: 'Payment confirmation failed' });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { transactionId }, 
      { paymentStatus: 1, paymentMethod: 2 }, 
      { new: true } 
    );

    if (!updatedOrder) {
      return NextResponse.json({ status: 400, message: 'Order paymentStatus failed updated' });
    }

    return NextResponse.json({ status: 200, message: 'Payment confirmed' });
  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json({ status: 500, message: 'Failed to confirm payment' });
  }
}
