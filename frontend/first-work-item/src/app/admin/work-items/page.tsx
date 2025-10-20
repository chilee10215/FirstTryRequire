"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminWorkItemsTable from "@/components/AdminWorkItemsTable";

export default function AdminWorkItemsPage() {
  const [username, setUsername] = useState("");
  const [manageLevel, setManageLevel] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedManageLevel = localStorage.getItem("manageLevel");

    if (!token || !storedUsername) {
      router.push("/");
      return;
    }

    // Check if user is admin
    if (storedManageLevel !== "admin") {
      router.push("/dashboard");
      return;
    }

    setUsername(storedUsername);
    setManageLevel(storedManageLevel || "");

    // Check for URL parameters for success messages
    const urlMessage = searchParams.get("message");
    const urlType = searchParams.get("type");
    if (urlMessage && urlType) {
      setMessage(urlMessage);
      setMessageType(urlType as "success" | "error");
      // Clear URL parameters
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("message");
      newUrl.searchParams.delete("type");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [router, searchParams]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("manageLevel");
    router.push("/");
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin - Work Items Management
              </h1>
              <p className="text-sm text-gray-600">Welcome, {username}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDashboard}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Message Display */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-md ${
                messageType === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* Admin Work Items Table */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <AdminWorkItemsTable onMessage={showMessage} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
