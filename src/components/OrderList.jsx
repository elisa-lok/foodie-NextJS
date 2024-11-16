"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const OrderList = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true); 
      const response = await axios.get(`/api/order/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200) {
        setOrders(response.data.orders);
      } else {
        setError("Failed to load orders. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("An error occurred while fetching orders.");
    } finally {
      setLoading(false); 
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", fontSize: "18px", margin: "20px 0" }}>
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", fontSize: "18px", margin: "20px 0", color: "red" }}>
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "80%",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#4caf50",
          margin: "20px 0",
        }}
      >
        Your Orders
      </h2>
      {orders.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: "#555",
            fontSize: "18px",
          }}
        >
          No orders found.
        </p>
      ) : (
        <ul
          style={{
            listStyleType: "none",
            padding: 0,
          }}
        >
          {orders.map((order) => (
            <li
              key={order._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "15px",
                marginBottom: "10px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <p style={{ margin: "5px 0", color: "#333" }}>Order Number: {order._id}</p>
              <p style={{ margin: "5px 0", color: "#333" }}>
                Total Amount: ${order.totalPrice}
              </p>
              <p style={{ margin: "5px 0", color: "#333" }}>Status: {order.orderStatus}</p>
              <p style={{ margin: "5px 0", color: "#333" }}>
                Order Date: {new Date(order.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderList;
