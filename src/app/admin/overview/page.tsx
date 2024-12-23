"use client";

import SideBar from "@/components/admin/SideBar";
import OverView from "@/components/admin/OverView";

export default function OverviewPage() {
  return (
    <main className="dashboard-layout">
    <SideBar />
    <section className="content-area">
      <div className="admin-header">
        <div className="admin-position">admin / Overview</div>
        <div className="admin-position-right">
          <div className="avatar">
            <img src="/assets/admin-avatar.png" alt="Admin Avatar" />
          </div>
        </div>
      </div>
      <OverView />
    </section>
  </main>
  );
}