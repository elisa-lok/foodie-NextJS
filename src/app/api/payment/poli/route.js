import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/app/models/Order";

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

    const totalAmount = orderInfo.totalPrice;
    const currency = process.env.POLI_CURRENCY || "NZD";

    const poliRequestData = {
      Amount: totalAmount.toFixed(2),
      CurrencyCode: currency,
      MerchantReference: orderId,
      MerchantData: JSON.stringify({ orderId }), 
      SuccessURL: process.env.POLI_RETURN_URL,
      FailureURL: process.env.POLI_RETURN_URL,
      CancellationURL: process.env.POLI_RETURN_URL,
    };

    const poliResponse = await fetch(
      `${process.env.POLI_API_URL}/v2/Transaction/Initiate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.POLI_API_KEY}:${process.env.POLI_API_SECRET}`
            ).toString("base64"),
        },
        body: JSON.stringify(poliRequestData),
      }
    );

    if(!poliResponse.ok) {
      return NextResponse.json(
        {
          status: 500,
          error: "Failed to initiate payment",
        }
      )
    }

    const poliData = await poliResponse.json();
    const { NavigateURL } = poliData;

    return NextResponse.json({ redirectUrl: NavigateURL });
  }catch(error) {
    return NextResponse.json(
      {
        status: 500,
        error: error.message || "Internal Server Error",
      }
    )
  }
}