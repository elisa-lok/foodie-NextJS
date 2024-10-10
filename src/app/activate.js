import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export function activatePage() {
  const [status, setStatus] = useState('loading');
  const searchParams = useSearchParams();
  const router = useRouter();

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
        <button onClick={() => router.push("/login")} className="btn">
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