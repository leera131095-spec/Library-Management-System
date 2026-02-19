"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: studentId,
        password: password,
      }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("student", JSON.stringify(data.student));
      router.push("/student-dashboard");
    } else {
      setError("Invalid Student ID or Password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200">

      {/* Glass Card */}
      <div className="bg-white/30 backdrop-blur-lg shadow-2xl rounded-3xl p-10 w-[400px] border border-white/40">

        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-purple-800 mb-2">
          Dream Library
        </h1>

        <p className="text-center text-gray-700 mb-6">
          Welcome back, Reader 📚
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Student ID */}
          <div>
            <label className="block text-gray-800 mb-1">
              Student ID
            </label>

            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your ID"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-800 mb-1">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your password"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-sm text-center">
              {error}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-xl font-semibold hover:scale-105 transition"
          >
            Enter Library ✨
          </button>

        </form>

      </div>

    </div>
  );
}
