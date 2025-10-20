"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthResponse {
  token: string;
  username: string;
  manageLevel: string;
  expiresAt: string;
}

interface ErrorResponse {
  message: string;
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      showMessage("Please fill in all fields", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5090/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const authResponse = data as AuthResponse;
        localStorage.setItem("token", authResponse.token);
        localStorage.setItem("username", authResponse.username);
        localStorage.setItem("manageLevel", authResponse.manageLevel);
        showMessage(`Welcome back, ${authResponse.username}!`, "success");
        // Redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        const errorData = data as ErrorResponse;
        showMessage(errorData.message || "Login failed", "error");
      }
    } catch (error) {
      showMessage(
        "Network error. Please check if the backend is running.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!username.trim() || !password.trim() || !email.trim()) {
      showMessage("Please fill in all fields", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5090/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();

      if (response.ok) {
        const authResponse = data as AuthResponse;
        localStorage.setItem("token", authResponse.token);
        localStorage.setItem("username", authResponse.username);
        localStorage.setItem("manageLevel", authResponse.manageLevel);
        showMessage(
          `Account created successfully! Welcome, ${authResponse.username}!`,
          "success"
        );
        // Redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        const errorData = data as ErrorResponse;
        showMessage(errorData.message || "Registration failed", "error");
      }
    } catch (error) {
      showMessage(
        "Network error. Please check if the backend is running.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">Or create a new account</p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-md ${
              messageType === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email (for registration)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email (required for registration)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoading}
              className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={handleCreateUser}
              disabled={isLoading}
              className="group relative flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
