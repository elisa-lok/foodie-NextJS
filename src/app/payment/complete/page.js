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
      width: '80%',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      border: '1px solid #ffc404',
      borderRadius: '2px',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      margin: '0 auto',
    }}>
      {paymentStatus === 'success' ? (
        <>
          <h1 style={{ color: '#ffc404' }}>Payment Successful!</h1>
          <p>Thank you for your purchase!</p>
          <p style={{ color: '#888', fontSize: '14px', marginTop: '20px' }}>
            Redirecting to your order details in 3 seconds...
          </p>
            <p style={{ marginTop: '20px' }}>If not redirected automatically, 
              please <a style={{ color: 'red' }} href={`/order/details?transactionId=${transactionId}`}> click here</a>.
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
