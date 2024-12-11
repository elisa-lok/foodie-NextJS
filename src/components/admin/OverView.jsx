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
        setSummaryData(summaryResponse.data.data);
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
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-center">
            Orders This Month
          </h3>
          <p className="text-xl font-bold text-center">
            {summaryData.ordersThisMonth}
          </p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-center">
            Revenue This Month
          </h3>
          <p className="text-xl font-bold text-center">
            {summaryData.revenueThisMonth}
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-center">
            New Users This Month
          </h3>
          <p className="text-xl font-bold text-center">
            {summaryData.newUsersThisMonth}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8">
        <div>
          <h4 className="text-lg font-semibold mb-2">Recent Users</h4>
          <ul className="list-disc">
            {recentData.recentUsers.map((user) => (
              <li key={user._id}>{user.email}</li>
            ))}
          </ul>
          <button
            onClick={() => setCurrentView("users")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            More Users
          </button>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">Recent Orders</h4>
          <ul className="list-disc">
            {recentData.recentOrders.map((order) => (
              <li key={order._id}>{order.name}</li>
            ))}
          </ul>
          <button
            onClick={() => setCurrentView("orders")}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            More Orders
          </button>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">Recent Products</h4>
          <ul className="list-disc">
            {recentData.recentProducts.map((product) => (
              <li key={product._id}>{product.name}</li>
            ))}
          </ul>
          <button
            onClick={() => setCurrentView("products")}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            More Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverView;
