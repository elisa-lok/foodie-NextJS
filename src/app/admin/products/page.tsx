"use client";

import SideBar from "@/components/admin/SideBar";
import ProductList from "@/components/admin/ProductList"; 

export default function ProductsPage() {
  return (
    <main className="dashboard-layout">
    <SideBar />
    <section className="content-area">
      <div className="admin-header">
        <div className="admin-position">Admin / Products</div>
        <div className="admin-position-right">
          <div className="avatar">
            <img src="/assets/admin-avatar.png" alt="Admin Avatar" />
          </div>
        </div>
      </div>
      <ProductList />
    </section>
  </main>
  );
}