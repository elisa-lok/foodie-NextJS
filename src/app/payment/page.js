"use client"; 

import { useSearchParams } from "next/navigation"

export default function Payment() {
  const params = useSearchParams();
  const orderId = params.get('orderId');
  const amount = params.get('amount');

  return (
    <div>
      <h1>Payment</h1>
      <div>
        <p>Order ID: {orderId}</p>
        <p>Amount: {amount}</p>
      </div>
    </div>
  )
}