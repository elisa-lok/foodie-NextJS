'use client';

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { modalActions } from "@/app/store/modal";
import axios from "axios";

export default function ActivatePage() {
  const [status, setStatus] = useState('loading');
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const activateAccount = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
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
  </div>
  )
}