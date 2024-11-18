"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { currencyFormatter, formatDate } from "@/utils/formatter"; 
import axios from 'axios';
import styles from './details.css'; 
import { PAYMENT_STATUSES, ORDER_STATUSES, PAYMENT_METHODS } from '@/constants/payment';

export default function OrderDetailsPage() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if(orderId){
      fetchOrderDetails(orderId);
    }
  }, [searchParams]);

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/order/details`, {
        params: { orderId }
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
    return <div className={`${styles.loading}`}>Loading...</div>;
  }

  if (error) {
    return <div className={`${styles.error}`}>{error}</div>;
  }

  return (
    <div className="order-details-container">

    {orderDetails && (
      <div className="order-info-card">
          <h2 className="order-section-title">Order Details</h2>
        <p className="order-text">Order Number: {orderDetails._id}</p>
        <p className="order-text">Order Recipient: {orderDetails.name}</p>
        <p className="order-text">Email: {orderDetails.email}</p>
        <p className="order-text">Phone Number: {orderDetails.phone}</p>
        <p className="order-text">Order Handle: {orderDetails.pickupMethod === 0 ? 'Delivery' : 'Pickup'}</p>
        <p className="order-text">Address: {orderDetails.address}</p>
        <p className="order-text">OrderStatus: {ORDER_STATUSES[orderDetails.orderStatus]}</p>
        <p className="order-text">PaymentStatus: {PAYMENT_STATUSES[orderDetails.paymentStatus]}</p>
        <p className="order-text">PaymentMethod: {PAYMENT_METHODS[orderDetails.paymentMethod]}</p>
        <p className="order-text">CreatedAt: {formatDate(orderDetails.createdAt)}</p>

        <h2 className="order-section-title">Items</h2>
        <ul className="order-items-list">
          {orderDetails.cartItems.map((item) => (
            <li key={item.id} className="order-item">
              <span className="order-item-name">{item.name}</span>
              <span className="order-item-price">{currencyFormatter.format(item.price)} x {item.quantity}</span>
            </li>
          ))}
        </ul>
        <p className="order-total">Total Amount: {currencyFormatter.format(orderDetails.totalPrice)}</p>
        <a href='/account' className="order-back-link">Back to Account</a>
      </div>
    )}
  </div>
  );
}
