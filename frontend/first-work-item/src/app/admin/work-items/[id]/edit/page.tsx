"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { WorkItem } from "@/types/workItem";
import {
  mockWorkItemService,
  UpdateWorkItemRequest,
} from "@/services/mockWorkItemService";

// Use mock service for testing - replace with workItemService when backend is ready
const service = mockWorkItemService;

export default function EditWorkItemPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [manageLevel, setManageLevel] = useState("");
  const [workItem, setWorkItem] = useState<WorkItem | null>(null);
  const router = useRouter();
  const params = useParams();
  const workItemId = params.id as string;

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

    // Load work item data
    loadWorkItem();
  }, [router, workItemId]);

  const loadWorkItem = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Get all work items and find the one with matching ID
      const response = await service.getWorkItems();
      const item = response.workItems.find(
        (w) => w.id === parseInt(workItemId)
      );

      if (!item) {
        setError("Work item not found");
        return;
      }

      setWorkItem(item);
      setTitle(item.title);
      setDescription(item.description || "");
    } catch (err) {
      setError("Failed to load work item");
      console.error("Error loading work item:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("manageLevel");
    router.push("/");
  };

  const handleBackToAdmin = () => {
    router.push("/admin/work-items");
  };

  const handleSave = async () => {
    // Validate title
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      const updateRequest: UpdateWorkItemRequest = {
        id: parseInt(workItemId),
        title: title.trim(),
        description: description.trim() || undefined,
      };

      await service.updateWorkItem(updateRequest);

      // Navigate back to admin page with success message
      router.push(
        "/admin/work-items?message=Work item updated successfully&type=success"
      );
    } catch (error) {
      setError("Failed to update work item. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/work-items");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading work item...</div>
      </div>
    );
  }

  if (error || !workItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">
            {error || "Work item not found"}
          </div>
          <button
            onClick={handleBackToAdmin}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Work Item #{workItem.id}
              </h1>
              <p className="text-sm text-gray-600">Welcome, {username}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToAdmin}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Admin
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
      <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Work Item Details
              </h2>
            </div>
            <div className="px-6 py-6 space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-md bg-red-50 text-red-800 border border-red-200">
                  {error}
                </div>
              )}

              {/* Work Item ID (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Item ID
                </label>
                <input
                  type="text"
                  value={workItem.id}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
                />
              </div>

              {/* Title Field */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter work item title"
                  disabled={isSaving}
                />
              </div>

              {/* Description Field */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter work item description (optional)"
                  disabled={isSaving}
                />
              </div>

              {/* Status (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <input
                  type="text"
                  value={workItem.status}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
