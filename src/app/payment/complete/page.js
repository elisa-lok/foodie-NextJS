"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios'; 

export default function PaymentCompletePage() {
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [transactionId, setTransactionId] = useState(null);

  useEffect(() => {
    const status = searchParams.get("status");
    const transactionId = searchParams.get("transactionId");

    setPaymentStatus(status);
    setTransactionId(transactionId);

    if (status === 'success') {
      confirmPayment(transactionId);
    }
  }, [searchParams]);

  const confirmPayment = async (transactionId) => {
    try {
      const response = await axios.post('/api/payment/confirm', {
        transactionId,
      });
      
      if (response.data.status === 200) {
        console.log("Payment confirmed successfully");
        setTimeout(() => {
          router.push(`/order/details?transactionId=${transactionId}`);
        }, 3000); 
      } else {
        console.error("Failed to confirm payment status");
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
    }
  };

  return (
    <>
      <div style={{ 
      textAlign: 'center', 
      marginTop: '50px',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      border: '2px solid #ffc404',
      borderRadius: '10px',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      {paymentStatus === 'success' ? (
        <>
          <h1 style={{ color: '#4caf50' }}>Payment Successful</h1>
          <p>Thank you for your purchase!</p>
          <p>Your transaction ID is: <strong>{transactionId}</strong></p>
          <p style={{ color: '#888', fontSize: '14px', marginTop: '20px' }}>
            Redirecting to your order details in 3 seconds...
          </p>
        </>
      ) : (
        <>
          <h1 style={{ color: '#f44336' }}>Payment Failed</h1>
          <p>There was an issue with your payment. Please try again.</p>
        </>
      )}
      </div>
    </>
  );
}
