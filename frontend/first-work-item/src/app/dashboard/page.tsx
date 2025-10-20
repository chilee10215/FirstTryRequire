"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WorkItemsTable from "@/components/WorkItemsTable";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [manageLevel, setManageLevel] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedManageLevel = localStorage.getItem("manageLevel");

    if (!token || !storedUsername) {
      router.push("/");
      return;
    }

    setUsername(storedUsername);
    //Todo: setManageLevel(storedManageLevel || "");
    setManageLevel("admin");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("manageLevel");
    router.push("/");
  };

  const handleManageWorkItems = () => {
    router.push("/admin/work-items");
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
                Work Item Management
              </h1>
              <p className="text-sm text-gray-600">Welcome, {username}</p>
            </div>
            <div className="flex items-center space-x-4">
              {manageLevel === "admin" && (
                <button
                  onClick={handleManageWorkItems}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Manage Work Items
                </button>
              )}
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

          {/* Work Items Table */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Work Items</h2>
            </div>
            <div className="p-6">
              <WorkItemsTable onMessage={showMessage} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
