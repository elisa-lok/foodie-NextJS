"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderList from "./OrderList";
import UserList from "./UserList";
import ProductList from "./ProductList";

const OverView = () => {
  const [summaryData, setSummaryData] = useState({
    ordersThisMonth: 0,
    revenueThisMonth: "$0",
    newUsersThisMonth: 0,
  });
  const [recentData, setRecentData] = useState({
    recentUsers: [],
    recentOrders: [],
    recentProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("overview");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("admin_token");
      try {
        const [summaryResponse, recentResponse] = await Promise.all([
          axios.get("/api/admin/overview/summary", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("/api/admin/overview/recent", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setSummaryData(summaryResponse.data);
        setRecentData(recentResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (currentView === "orders") {
    return <OrderList onBack={() => setCurrentView("overview")} />;
  } else if (currentView === "users") {
    return <UserList onBack={() => setCurrentView("overview")} />;
  } else if (currentView === "products") {
    return <ProductList onBack={() => setCurrentView("overview")} />;
  }

  return (
    <div className="overview-page" style={{ padding: "20px" }}>
      <div
        className="summary-section"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <h3>Orders This Month</h3>
          <p>{summaryData.ordersThisMonth}</p>
        </div>
        <div>
          <h3>Revenue This Month</h3>
          <p>{summaryData.revenueThisMonth}</p>
        </div>
        <div>
          <h3>New Users This Month</h3>
          <p>{summaryData.newUsersThisMonth}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <h4>Recent Users</h4>
          <ul>
            {recentData.recentUsers.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
          <button onClick={() => setCurrentView("users")}>More Users</button>
        </div>

        <div style={{ flex: 2 }}>
          <h4>Recent Orders</h4>
          <ul>
            {recentData.recentOrders.map((order) => (
              <li key={order.id}>{order.description}</li>
            ))}
          </ul>
          <button onClick={() => setCurrentView("orders")}>More Orders</button>
        </div>

        <div style={{ flex: 1 }}>
          <h4>Recent Products</h4>
          <ul>
            {recentData.recentProducts.map((product) => (
              <li key={product.id}>{product.name}</li>
            ))}
          </ul>
          <button onClick={() => setCurrentView("products")}>
            More Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverView;
