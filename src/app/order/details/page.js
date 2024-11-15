"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function OrderDetailsPage() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const transactionId = searchParams.get("transactionId");
    if (transactionId) {
      fetchOrderDetails(transactionId);
    }
  }, [searchParams]);

  const fetchOrderDetails = async (transactionId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/order/details`, {
        params: { transactionId }
      });
      if (response.data.status === 200) {
        setOrderDetails(response.data.order);
        setLoading(false);
      } else {
        console.error("Error fetching order details:", response.data.error);
      }
    } catch (error) {
      setError("Failed to load order details. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>{error}</div>;
  }

  return (
    <div style={{
      width: '80%',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '10px',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#4caf50' }}>Order Details</h1>
      
      <p><strong>Transaction ID:</strong> {orderDetails.transactionId}</p>
      <p><strong>Status:</strong> {orderDetails.status}</p>
      <p><strong>Total Amount:</strong> ${orderDetails.amount}</p>
      <p><strong>Items:</strong></p>
      
      <ul>
        {orderDetails.cartItems?.map((item, index) => (
          <li key={index}>
            {item.name} - Quantity: {item.quantity} - Price: ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
