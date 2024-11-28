"use client";

import { useEffect, useState } from "react";
import { checkAdminLogin } from "@/utils/auth";
import { useRouter } from "next/navigation";
import UserList from "@/components/admin/UserList";
import OrderList from "@/components/admin/OrderList";
import "./dashboard.css";

const initialAuthStatus = async () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      return { isAuthenticated: false, isLoading: false };
    }

    try {
      const response = await checkAdminLogin(token);
      if (response.data.status !== 200) {
        console.log("Token is invalid, admin is not logged in.");
        localStorage.removeItem("admin_token");
        return { isAuthenticated: false, isLoading: false };
      }
      return { isAuthenticated: true, isLoading: false };
    } catch (error) {
      console.error("Error verifying admin login:", error);
      return { isAuthenticated: false, isLoading: false };
    }
  }
  return { isAuthenticated: false, isLoading: true }; 
};

export default function AdminDashboard() {
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState("Overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const verifyAdminLogin = async () => {
      const { isAuthenticated, isLoading } = await initialAuthStatus();
      setIsAuthenticated(isAuthenticated);
      setIsLoading(isLoading);

      if (!isAuthenticated) {
        router.push("/admin/login");
      }
    };

    verifyAdminLogin();
  }, [router]);

  const renderContent = () => {
    switch (selectedSection) {
      case "Overview":
        return <p>Welcome to the Admin Dashboard Overview.</p>;
      case "Users":
        return <UserList />;
      case "Products":
        return <p>View products here.</p>;
      case "Orders":
        return <OrderList />;
      case "Reviews":
        return <p>Manage reviews here.</p>;
      case "Settings":
        return <p>Manage settings here.</p>;
      default:
        return <p>Select an option from the sidebar.</p>;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="dashboard-layout">
      <aside className="sidebar">
        <div className="logo">
          <i className="pizza-icon">🍕</i>
          <h3>Level One Pizza</h3>
        </div>
        <nav>
          <ul>
            <li
              className={selectedSection === "Overview" ? "active" : ""}
              onClick={() => setSelectedSection("Overview")}
            >
              Overview
            </li>
            <li
              className={selectedSection === "Users" ? "active" : ""}
              onClick={() => setSelectedSection("Users")}
            >
              Manage Users
            </li>
            <li
              className={selectedSection === "Products" ? "active" : ""}
              onClick={() => setSelectedSection("Products")}
            >
              Products
            </li>
            <li
              className={selectedSection === "Orders" ? "active" : ""}
              onClick={() => setSelectedSection("Orders")}
            >
              Orders
            </li>
            <li
              className={selectedSection === "Reviews" ? "active" : ""}
              onClick={() => setSelectedSection("Reviews")}
            >
              Reviews
            </li>
            <li
              className={selectedSection === "Settings" ? "active" : ""}
              onClick={() => setSelectedSection("Settings")}
            >
              Settings
            </li>
          </ul>
        </nav>
      </aside>
      <section className="content-area">
        <div className="admin-header">
          <div className="admin-position">admin / {selectedSection}</div>
          <div className="admin-position-right">
            <div className="avatar">
              <img src="/assets/admin-avatar.png" alt="Admin Avatar" />
            </div>
          </div>
        </div>
        {renderContent()}
      </section>
    </main>
  );
}
