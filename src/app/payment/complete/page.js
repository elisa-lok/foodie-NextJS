"use client";

import { useEffect, useState } from 'react';
import axios from 'axios'; 
import { useRouter } from 'next/navigation';

export default function PaymentCompletePage() {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const status = searchParams.get("status");
    const transactionId = searchParams.get("transactionId");
    const orderId = searchParams.get("orderId");

    setPaymentStatus(status);
    setOrderId(orderId);

    if (status === 'success') {
      confirmPayment(transactionId);
    }
  }, [searchParams]);

  const confirmPayment = async (transactionId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post('/api/payment/confirm', {
        transactionId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data.status === 200) {
        console.log("Payment confirmed successfully");
        setTimeout(() => {
          router.push(`/order/details?orderId=${response.data.orderId}`);
        }, 3000); 
      } else {
        console.error(response.data.error);
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
              please <a style={{ color: 'red' }} href={`/order/details?orderId=${orderId}`}> click here</a>.
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
