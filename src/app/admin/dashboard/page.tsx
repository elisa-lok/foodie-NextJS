"use client";
import { useState } from "react";
import "./dashboard.css";

export default function AdminDashboard() {
  const [selectedSection, setSelectedSection] = useState("Overview");

  const renderContent = () => {
    switch (selectedSection) {
      case "Overview":
        return <p>Welcome to the Admin Dashboard Overview.</p>;
      case "Users":
        return <p>Manage users here.</p>;
      case "Products":
        return <p>View products here.</p>;
      case "Orders":
        return <p>View orders here.</p>;
      case "Reviews":
        return <p>Manage reviews here.</p>;
      case "Settings":
        return <p>Manage settings here.</p>;
      default:
        return <p>Select an option from the sidebar.</p>;
    }
  };

  return (
    <main className="dashboard-layout">
      <aside className="sidebar">
        <div className="logo">
          <i className="pizza-icon">🍕</i>
          <h3>Level One</h3>
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
            <li className={selectedSection === "Settings" ? "active" : ""}
             onClick={() => setSelectedSection("Settings")}>
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
          {/* <div className="notifications">
            <span role="img" aria-label="notifications">
              🔔
            </span>
          </div> */}
          </div>
        </div>
      {renderContent()}
    </section>
  </main>
  );
}
