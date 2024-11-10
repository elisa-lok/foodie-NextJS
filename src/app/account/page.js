"use client";
import { useEffect, useState } from "react";
import { modalActions } from "@/app/store/modal";
import { useDispatch } from 'react-redux';
import { useRouter } from "next/navigation";
import { checkUserLogin } from "@/utils/auth";
import AccountSidebar from "@/components/AccountSidebar";
import AccountContent from "@/components/AccountContent";
import Header from '@/components/Header';
import "./account.css";

export default function AccountPage() {
  const [selectedTab, setSelectedTab] = useState("info");
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const verifyUserLogin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, user is not logged in.");
        dispatch(modalActions.openLoginModal()); 
        router.push("/");
        return; 
      }

      try {
        const response = await checkUserLogin(token);
        if (response.data.status !== 200) {
          console.log("Token is invalid, user is not logged in.");
          localStorage.removeItem("token");
          dispatch(modalActions.openLoginModal()); 
          router.push("/");
        }
      } catch (error) {
        console.log("Error checking user login:", error);
        localStorage.removeItem("token");
        dispatch(modalActions.openLoginModal()); 
        router.push("/");
      }
    };

    const fetchUserData = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData)); 
      } else {
        console.log("No user information available.");
      }
      setLoading(false);
    };

    verifyUserLogin(); 
    fetchUserData();
  }, [dispatch, router]); 

  if (loading) {
    return <p>Loading user information...</p>; 
  }

  return (
    <>
      <Header />
      <main className="account-page min-h-screen flex bg-gradient-to-r from-[#29251c] to-[#2c2306] mt-[-50px]">
        <AccountSidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <AccountContent selectedTab={selectedTab} user={user} />
      </main>
    </>
  );
}
