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
      } else {
        console.error("Failed to confirm payment status");
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {paymentStatus === 'success' ? (
        <>
          <h1>Payment Successful</h1>
          <p>Thank you for your purchase!</p>
          <p>Your transaction ID is: {transactionId}</p>
        </>
      ) : (
        <>
          <h1>Payment Failed</h1>
          <p>There was an issue with your payment. Please try again.</p>
        </>
      )}
    </div>
  );
}