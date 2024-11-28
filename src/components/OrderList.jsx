"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  PAYMENT_STATUSES,
  PAYMENT_METHODS,
  ORDER_STATUSES,
} from "@/constants/payment";
import Pagination from "@/components/UI/Pagination";

const OrderList = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const response = await axios.get(`/api/orders/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200) {
        setOrders(response.data.orders);
      } else {
        setError(response.data.error || "Failed to fetch orders.");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("An error occurred while fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
      <div
        style={{
          textAlign: "center",
          fontSize: "18px",
          margin: "20px 0",
          color: "red",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "90%",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
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
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Order Number</th>
                <th style={tableHeaderStyle}>Buyer</th>
                <th style={tableHeaderStyle}>Order Status</th>
                <th style={tableHeaderStyle}>Payment Status</th>
                <th style={tableHeaderStyle}>Payment Method</th>
                <th style={tableHeaderStyle}>Order Date</th>
                <th style={tableHeaderStyle}>Details</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order._id}>
                  <td style={tableCellStyle}>{order._id}</td>
                  <td style={tableCellStyle}>{order.name}</td>
                  <td style={tableCellStyle}>
                    {ORDER_STATUSES[order.orderStatus]}
                  </td>
                  <td style={tableCellStyle}>
                    {PAYMENT_STATUSES[order.paymentStatus]}
                  </td>
                  <td style={tableCellStyle}>
                    {PAYMENT_METHODS[order.paymentMethod]}
                  </td>
                  <td style={tableCellStyle}>
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td style={tableCellStyle}>
                    <a
                      href={`/order/details?orderId=${order._id}`}
                      style={{
                        color: "#007bff",
                        textDecoration: "none",
                      }}
                    >
                      Details
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(orders.length / ordersPerPage)}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

const tableHeaderStyle = {
  padding: "10px",
  border: "1px solid #ddd",
  textAlign: "left",
  backgroundColor: "#fddfgg",
};

const tableCellStyle = {
  padding: "10px",
  border: "1px solid #ddd",
};

export default OrderList;
