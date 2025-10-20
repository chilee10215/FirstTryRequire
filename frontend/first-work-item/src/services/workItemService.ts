import { WorkItem, WorkItemResponse, WorkItemUpdateRequest } from '@/types/workItem';

const API_BASE_URL = 'http://localhost:5090/api';

class WorkItemService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  async getWorkItems(): Promise<WorkItemResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/workitems`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching work items:', error);
      throw error;
    }
  }

  async updateWorkItemStatus(updateRequest: WorkItemUpdateRequest): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/workitems/update-status`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating work items:', error);
      throw error;
    }
  }
}

export const workItemService = new WorkItemService();
