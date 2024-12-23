"use client";

import SideBar from "@/components/admin/SideBar";
import OrderList from "@/components/admin/OrderList";

export default function OrdersPage() {
  return (
    <main className="dashboard-layout">
    <SideBar />
    <section className="content-area">
      <div className="admin-header">
        <div className="admin-position">admin / Orders</div>
        <div className="admin-position-right">
          <div className="avatar">
            <img src="/assets/admin-avatar.png" alt="Admin Avatar" />
          </div>
        </div>
      </div>
      <OrderList />
    </section>
  </main>
  );
}