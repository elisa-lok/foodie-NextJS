"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import './admin.css';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token"); 
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>This is admin home page</div>
      </main>
    </>
  );
}
