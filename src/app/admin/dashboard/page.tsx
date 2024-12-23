"use client";

import { useEffect, useState } from "react";
import { checkAdminLogin } from "@/utils/auth";
import { useRouter } from "next/navigation";
import UserList from "@/components/admin/UserList";
import OrderList from "@/components/admin/OrderList";
import ProductList from "@/components/admin/ProductList";
import OverView from "@/components/admin/OverView";
import SideBar from "@/components/admin/SideBar";
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
        return <OverView />;
      case "Users":
        return <UserList />;
      case "Products":
        return <ProductList />;
      case "Orders":
        return <OrderList />;
      case "Reviews":
        return <p>Manage reviews here.</p>;
      case "Settings":
        return <p>Manage settings here.</p>;
      case "Logout":
        return <p>Logout functionality goes here.</p>;
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
      <SideBar />
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
