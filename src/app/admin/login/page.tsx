// app/admin/login/page.tsx
"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import "./login.css"; 

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    const isAuthenticated = true; 

    if (isAuthenticated) {
      router.push("/admin/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <main className="login-container">
      <div className="login-box">
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="submit-button">Login</button>
        </form>
      </div>
    </main>
  );
}
