import { NextResponse } from "next/server";
import dbConnect from '@/utils/db';
import Order from "@/app/models/Order";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  await dbConnect();

  try {
    const { orderId } = await req.json();
    if(!orderId) {
      return NextResponse.json(
        {
          status: 400,
          error: "Order ID is required",
        }
      )
    }

    const order = await Order.findOne({ _id: orderId });

    if(!order) {
      return NextResponse.json(
        {
          status: 404,
          error: "Order not found",
        }
      )
    }

    // const totalAmount = orderInfo.totalPrice;
    // const currency = process.env.POLI_CURRENCY || "NZD";

    // const poliRequestData = {
    //   Amount: totalAmount.toFixed(2),
    //   CurrencyCode: currency,
    //   MerchantReference: orderId,
    //   MerchantData: JSON.stringify({ orderId }), 
    //   SuccessURL: process.env.POLI_RETURN_URL,
    //   FailureURL: process.env.POLI_RETURN_URL,
    //   CancellationURL: process.env.POLI_RETURN_URL,
    // };

    // const poliResponse = await axios.post(
    //   `${process.env.POLI_API_URL}/v2/Transaction/Initiate`,
    //   poliRequestData,
    //   {
    //     auth: {
    //       username: process.env.POLI_API_KEY,
    //       password: process.env.POLI_API_SECRET,
    //     },
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    // if(!poliResponse.ok) {
    //   return NextResponse.json(
    //     {
    //       status: 500,
    //       error: "Failed to initiate payment",
    //     }
    //   )
    // }
    // const transactionId = response.data.TransactionID; 
    
    const transactionId = uuidv4();
    
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId }, 
      { transactionId }, 
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({
        status: 500,
        message: "Failed to update order with transactionId",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Payment initiation successful",
      transactionId,
      //redirectUrl: response.data.NavigateURL, 
      redirectUrl: '/payment/complete',
    });
  }catch(error) {
    return NextResponse.json(
      {
        status: 500,
        error: error.message || "Internal Server Error",
      }
    )
  }
}