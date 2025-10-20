"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WorkItem } from "@/types/workItem";
import { workItemService } from "@/services/workItemService";
import { mockWorkItemService } from "@/services/mockWorkItemService";

// Use mock service for testing - replace with workItemService when backend is ready
const service = mockWorkItemService;

interface WorkItemsTableProps {
  onMessage: (message: string, type: "success" | "error") => void;
}

type SortOrder = "asc" | "desc";

export default function WorkItemsTable({ onMessage }: WorkItemsTableProps) {
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [originalWorkItems, setOriginalWorkItems] = useState<WorkItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [itemToWithdraw, setItemToWithdraw] = useState<WorkItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const router = useRouter();

  // Load work items on component mount
  useEffect(() => {
    loadWorkItems();
  }, []);

  // Restore state from localStorage if available
  useEffect(() => {
    const savedState = localStorage.getItem("workItemsTableState");
    if (savedState && workItems.length > 0) {
      try {
        const state = JSON.parse(savedState);
        setSelectedItems(new Set(state.selectedItems));
        setSortOrder(state.sortOrder);
        setCurrentPage(state.currentPage);
        setItemsPerPage(state.itemsPerPage);

        // Restore work item statuses
        const updatedItems = workItems.map((item) => {
          const savedItem = state.workItems.find((s: any) => s.id === item.id);
          return savedItem ? { ...item, status: savedItem.status } : item;
        });
        setWorkItems(updatedItems);

        // Clear the saved state
        localStorage.removeItem("workItemsTableState");
      } catch (error) {
        console.error("Error restoring table state:", error);
      }
    }
  }, [workItems]);

  const loadWorkItems = async () => {
    try {
      setIsLoading(true);
      const response = await service.getWorkItems();
      const sortedItems = sortWorkItems(response.workItems, sortOrder);
      setWorkItems(sortedItems);
      setOriginalWorkItems([...sortedItems]);
      setSelectedItems(new Set());
    } catch (error) {
      onMessage("Failed to load work items", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const sortWorkItems = (items: WorkItem[], order: SortOrder): WorkItem[] => {
    return [...items].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return order === "desc" ? dateB - dateA : dateA - dateB;
    });
  };

  const handleSortToggle = () => {
    const newOrder: SortOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newOrder);
    const sortedItems = sortWorkItems(workItems, newOrder);
    setWorkItems(sortedItems);
  };

  const handleSelectAll = () => {
    const selectableItems = workItems.filter(
      (item) => item.status !== "confirmed"
    );

    if (selectedItems.size === selectableItems.length) {
      // Unselect all - change back to created
      const updatedItems = workItems.map((item) =>
        selectedItems.has(item.id)
          ? { ...item, status: "created" as const }
          : item
      );
      setWorkItems(updatedItems);
      setSelectedItems(new Set());
    } else {
      // Select all selectable items - change to pending
      const updatedItems = workItems.map((item) =>
        selectableItems.some((selectable) => selectable.id === item.id)
          ? { ...item, status: "pending" as const }
          : item
      );
      setWorkItems(updatedItems);
      setSelectedItems(new Set(selectableItems.map((item) => item.id)));
    }
  };

  const handleSelectItem = (itemId: number) => {
    const newSelected = new Set(selectedItems);
    const item = workItems.find((w) => w.id === itemId);

    if (!item || item.status === "confirmed") {
      return; // Don't allow selection of confirmed items
    }

    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
      // Change back to created when unselected
      const updatedItems = workItems.map((w) =>
        w.id === itemId ? { ...w, status: "created" as const } : w
      );
      setWorkItems(updatedItems);
    } else {
      newSelected.add(itemId);
      // Change to pending when selected
      const updatedItems = workItems.map((w) =>
        w.id === itemId ? { ...w, status: "pending" as const } : w
      );
      setWorkItems(updatedItems);
    }
    setSelectedItems(newSelected);
  };

  const handleConfirm = async () => {
    if (selectedItems.size === 0) return;

    try {
      setIsUpdating(true);
      await service.updateWorkItemStatus({
        workItemIds: Array.from(selectedItems),
        status: "confirmed",
      });

      // Update local state
      const updatedItems = workItems.map((item) =>
        selectedItems.has(item.id)
          ? { ...item, status: "confirmed" as const }
          : item
      );
      setWorkItems(updatedItems);
      setSelectedItems(new Set());

      onMessage(`Confirmed ${selectedItems.size} work item(s)`, "success");
    } catch (error) {
      onMessage("Error occurred", "error");
      // Reset to original state
      setWorkItems([...originalWorkItems]);
      setSelectedItems(new Set());
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setWorkItems([...originalWorkItems]);
    setSelectedItems(new Set());
  };

  const handleWithdrawClick = (item: WorkItem) => {
    setItemToWithdraw(item);
    setShowWithdrawModal(true);
  };

  const handleWithdrawConfirm = async () => {
    if (!itemToWithdraw) return;

    try {
      setIsUpdating(true);
      await service.updateWorkItemStatus({
        workItemIds: [itemToWithdraw.id],
        status: "created",
      });

      // Update local state
      const updatedItems = workItems.map((item) =>
        item.id === itemToWithdraw.id
          ? { ...item, status: "created" as const }
          : item
      );
      setWorkItems(updatedItems);

      onMessage("Work item withdrawn successfully", "success");
    } catch (error) {
      onMessage("Error occurred while withdrawing work item", "error");
    } finally {
      setIsUpdating(false);
      setShowWithdrawModal(false);
      setItemToWithdraw(null);
    }
  };

  const handleWithdrawCancel = () => {
    setShowWithdrawModal(false);
    setItemToWithdraw(null);
  };

  const handleTitleClick = (workItemId: number) => {
    // Store current state in localStorage for preservation when returning
    const currentState = {
      selectedItems: Array.from(selectedItems),
      sortOrder,
      currentPage,
      itemsPerPage,
      workItems: workItems.map((item) => ({
        id: item.id,
        status: item.status,
      })),
    };
    localStorage.setItem("workItemsTableState", JSON.stringify(currentState));

    // Navigate to work item detail page
    router.push(`/work-items/${workItemId}`);
  };

  // Pagination logic
  const totalPages = Math.ceil(workItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = workItems.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading work items...</div>
      </div>
    );
  }

  if (workItems.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg text-gray-600">Currently no work item</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedItems.size ===
                      workItems.filter((item) => item.status !== "confirmed")
                        .length &&
                    workItems.filter((item) => item.status !== "confirmed")
                      .length > 0
                  }
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                WorkItem No.
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={handleSortToggle}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Created Time</span>
                  <span className="text-sm">
                    {sortOrder === "desc" ? "↓" : "↑"}
                  </span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    disabled={item.status === "confirmed"}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 w-24">
                  {item.id}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  <button
                    onClick={() => handleTitleClick(item.id)}
                    className="text-left hover:text-indigo-600 hover:underline transition-colors duration-200 cursor-pointer"
                    title="Click to view details"
                  >
                    {item.title}
                  </button>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {formatDate(item.createdAt)}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {item.status === "confirmed" && (
                    <button
                      onClick={() => handleWithdrawClick(item)}
                      disabled={isUpdating}
                      className="px-2 py-1 text-xs font-medium text-white bg-red-600 border border-transparent rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Withdraw
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
        {/* Items per page selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Show:</span>
          {[10, 20, 50].map((size) => (
            <button
              key={size}
              onClick={() => handleItemsPerPageChange(size)}
              className={`px-2 py-1 text-xs font-medium rounded ${
                itemsPerPage === size
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {size}
            </button>
          ))}
          <span className="text-sm text-gray-700">items per page</span>
        </div>

        {/* Page navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 text-sm font-medium rounded ${
                    currentPage === pageNum
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={handleCancel}
          disabled={isUpdating}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={selectedItems.size === 0 || isUpdating}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? "Confirming..." : "Confirm"}
        </button>
      </div>

      {/* Withdraw Confirmation Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-25 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Withdraw
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to withdraw the work item "
                {itemToWithdraw?.title}"?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleWithdrawCancel}
                  disabled={isUpdating}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdrawConfirm}
                  disabled={isUpdating}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "Withdrawing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
