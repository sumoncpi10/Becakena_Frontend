"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../services/api";
import { jwtDecode } from "jwt-decode"; // ✅ FIX

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", { email, password });
      const token = res.data.token;

      localStorage.setItem("token", token);

      const user = jwtDecode(token); // ✅ works now

      if (user.role === "admin") router.push("/dashboard/admin");
      else if (user.role === "vendor") router.push("/dashboard/vendor");
      else router.push("/dashboard/user");

    } catch (err) {
      alert(err?.response?.data?.error || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 w-full max-w-sm rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-3 mb-4 w-full rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 mb-4 w-full rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-orange-500 text-white w-full py-3 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}