"use client";

import SideBar from "@/components/admin/SideBar";
import UserList from "@/components/admin/UserList";

export default function UsersPage() {
  return (
    <main className="dashboard-layout">
    <SideBar />
    <section className="content-area">
      <div className="admin-header">
        <div className="admin-position">admin / Users</div>
        <div className="admin-position-right">
          <div className="avatar">
            <img src="/assets/admin-avatar.png" alt="Admin Avatar" />
          </div>
        </div>
      </div>
      <UserList />
    </section>
  </main>
  );
}