"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import './admin.css';
import { checkAdminLogin } from "@/utils/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const verifyAdminLogin = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.replace("/admin/login");
        return;
      }

      const response = await checkAdminLogin(token);
      if (response.data.status !== 200) {
        localStorage.removeItem("admin_token");
        router.replace("/admin/login");
      }
    };

    verifyAdminLogin();
  }, [router]);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>This is admin home page</div>
      </main>
    </>
  );
}
