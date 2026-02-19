"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function LoginPage() {

  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {

    e.preventDefault();

    const success = login(username, password);

    if (success) {

      router.refresh();

    } else {

      setError("Invalid Username or Password");

    }

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200">

      <div className="bg-white/30 backdrop-blur-lg shadow-2xl rounded-3xl p-10 w-[400px] border border-white/40">

        <h1 className="text-4xl font-bold text-center text-purple-800 mb-2">

          Dream Library

        </h1>

        <p className="text-center text-gray-700 mb-6">

          Welcome back, Reader 📚

        </p>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>

            <label className="block text-gray-800 mb-1">

              Username

            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter username"
            />

          </div>

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
              placeholder="Enter password"
            />

          </div>

          {error && (

            <p className="text-red-600 text-sm text-center">

              {error}

            </p>

          )}

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
