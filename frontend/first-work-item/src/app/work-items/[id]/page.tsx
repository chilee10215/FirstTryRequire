"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { WorkItem } from "@/types/workItem";
import { workItemService } from "@/services/workItemService";
import { mockWorkItemService } from "@/services/mockWorkItemService";

// Use mock service for testing - replace with workItemService when backend is ready
const service = mockWorkItemService;

export default function WorkItemDetailPage() {
  const [workItem, setWorkItem] = useState<WorkItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const workItemId = params.id as string;

  useEffect(() => {
    loadWorkItem();
  }, [workItemId]);

  const loadWorkItem = async () => {
    try {
      setIsLoading(true);
      setError(null);

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
    } catch (err) {
      setError("Failed to load work item");
      console.error("Error loading work item:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    // Navigate back to dashboard with preserved state
    router.push("/dashboard");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "created":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
            onClick={handleBackClick}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Work Items
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Back Arrow Button - Top Left Corner */}
      <button
        onClick={handleBackClick}
        className="fixed top-4 left-4 z-50 p-3 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Go back to work items"
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Work Item Details
            </h1>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Work Item Number */}
            <div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Work Item Number
              </h2>
              <p className="mt-1 text-lg text-gray-900 font-mono">
                #{workItem.id}
              </p>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Title
              </h2>
              <p className="mt-1 text-xl text-gray-900 font-semibold">
                {workItem.title}
              </p>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Description
              </h2>
              <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                {workItem.description || "No description provided"}
              </p>
            </div>

            {/* Status */}
            <div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Status
              </h2>
              <div className="mt-1">
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                    workItem.status
                  )}`}
                >
                  {workItem.status}
                </span>
              </div>
            </div>

            {/* Created Time */}
            <div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Created Time
              </h2>
              <p className="mt-1 text-gray-900">
                {formatDate(workItem.createdAt)}
              </p>
            </div>

            {/* Last Updated Time */}
            <div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Last Updated Time
              </h2>
              <p className="mt-1 text-gray-900">
                {workItem.updatedAt
                  ? formatDate(workItem.updatedAt)
                  : "Not updated"}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
            Back to Top
          </button>
        </div>
      </div>
    </div>
  );
}
