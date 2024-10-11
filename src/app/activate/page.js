'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { modalActions } from "@/app/store/modal";
import Cart from "@/components/Cart";
import Checkout from "@/components/Checkout";
import LoginModal from "@/components/LoginModal";
import axios from "axios";

export default function activatePage() {
  const [status, setStatus] = useState('loading');
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const activateAccount = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        const response = await axios.get(`/api/activate?token=${token}`);
        if (response.data.status === 200) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
    }
    activateAccount();
  }, [searchParams]);

  return (
    <div className="activation-page">
    {status === "loading" && <p>Activating your account, please wait...</p>}
    {status === "success" && (
      <div>
        <h1>Account Activated!</h1>
        <p>Your account has been successfully activated. You can now log in.</p>
          <button className="btn" onClick={() => {
            dispatch(modalActions.openLoginModal());
        }}>
          Go to Login
        </button>
      </div>
    )}
    {status === "error" && (
      <div>
        <h1>Activation Failed</h1>
        <p>There was an issue activating your account. Please try again or contact support.</p>
        <button onClick={() => router.push("/")} className="btn">
          Go to Home
        </button>
      </div>
      )}
      <LoginModal />
      <Cart />
      <Checkout />
  </div>
  )
}