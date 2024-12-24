"use client";

import SideBar from "@/components/admin/SideBar";

export default function SettingsPage() {
    return (
      <main className="dashboard-layout">
      <SideBar />
      <section className="content-area">
        <div className="admin-header">
          <div className="admin-position">Admin / Settings</div>
          <div className="admin-position-right">
            <div className="avatar">
              <img src="/assets/admin-avatar.png" alt="Admin Avatar" />
            </div>
          </div>
        </div>
        Settings feature will be coming soon!
      </section>
    </main>
    )
}