import { WorkItem, WorkItemResponse, WorkItemUpdateRequest } from '@/types/workItem';

export interface CreateWorkItemRequest {
  title: string;
  description?: string;
}

export interface UpdateWorkItemRequest {
  id: number;
  title: string;
  description?: string;
}

// Mock data for testing
const mockWorkItems: WorkItem[] = [
  {
    id: 1,
    title: 'Fix login validation bug',
    description: 'Fix the validation bug that occurs when users enter invalid credentials during login process. The error message should be displayed properly and the form should reset correctly.',
    status: 'created',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    title: 'Implement user dashboard',
    description: 'Create a comprehensive user dashboard that displays user statistics, recent activities, and quick access to common features. Include charts and data visualization components.',
    status: 'created',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T14:20:00Z'
  },
  {
    id: 3,
    title: 'Add work item status tracking',
    description: 'Implement a comprehensive status tracking system for work items including created, pending, and confirmed states with proper state transitions and history logging.',
    status: 'created',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: 4,
    title: 'Update API documentation',
    description: 'Update the existing API documentation to reflect the latest changes in endpoints, request/response formats, and authentication requirements.',
    status: 'confirmed',
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-13T10:30:00Z'
  },
  {
    id: 5,
    title: 'Optimize database queries',
    description: 'Review and optimize slow database queries by adding proper indexes, rewriting complex queries, and implementing query caching where appropriate.',
    status: 'created',
    createdAt: '2024-01-11T11:30:00Z',
    updatedAt: '2024-01-11T11:30:00Z'
  },
  {
    id: 6,
    title: 'Implement user authentication',
    description: 'Implement secure user authentication system with JWT tokens, password hashing, and session management including login, logout, and password reset functionality.',
    status: 'created',
    createdAt: '2024-01-10T15:45:00Z',
    updatedAt: '2024-01-10T15:45:00Z'
  },
  {
    id: 7,
    title: 'Add email notifications',
    description: 'Implement email notification system for work item updates, status changes, and important announcements with customizable notification preferences.',
    status: 'created',
    createdAt: '2024-01-09T09:20:00Z',
    updatedAt: '2024-01-09T09:20:00Z'
  },
  {
    id: 8,
    title: 'Create API documentation',
    description: 'Create comprehensive API documentation using OpenAPI/Swagger specification including endpoint descriptions, request/response examples, and authentication details.',
    status: 'created',
    createdAt: '2024-01-08T14:15:00Z',
    updatedAt: '2024-01-08T14:15:00Z'
  },
  {
    id: 9,
    title: 'Fix responsive design issues',
    description: 'Fix responsive design issues across different screen sizes and devices, ensuring proper layout and functionality on mobile, tablet, and desktop views.',
    status: 'created',
    createdAt: '2024-01-07T11:00:00Z',
    updatedAt: '2024-01-07T11:00:00Z'
  },
  {
    id: 10,
    title: 'Add data validation',
    description: 'Implement comprehensive client-side and server-side data validation for all forms and API endpoints to ensure data integrity and security.',
    status: 'created',
    createdAt: '2024-01-06T16:30:00Z',
    updatedAt: '2024-01-06T16:30:00Z'
  },
  {
    id: 11,
    title: 'Implement file upload',
    description: 'Implement secure file upload functionality with support for multiple file types, size validation, and proper file storage with cloud integration.',
    status: 'created',
    createdAt: '2024-01-05T13:45:00Z',
    updatedAt: '2024-01-05T13:45:00Z'
  },
  {
    id: 12,
    title: 'Add search functionality',
    description: 'Implement advanced search functionality across work items with filtering, sorting, and full-text search capabilities including search history and saved searches.',
    status: 'created',
    createdAt: '2024-01-04T10:15:00Z',
    updatedAt: '2024-01-04T10:15:00Z'
  }
];

class MockWorkItemService {
  private getNextId(): number {
    return Math.max(...mockWorkItems.map(item => item.id)) + 1;
  }

  async getWorkItems(): Promise<WorkItemResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      workItems: mockWorkItems,
      totalCount: mockWorkItems.length
    };
  }

  async updateWorkItemStatus(updateRequest: WorkItemUpdateRequest): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate potential failure (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Simulated network error');
    }

    // Update mock data
    updateRequest.workItemIds.forEach(id => {
      const item = mockWorkItems.find(item => item.id === id);
      if (item) {
        item.status = updateRequest.status;
        item.updatedAt = new Date().toISOString();
      }
    });
  }

  async createWorkItem(request: CreateWorkItemRequest): Promise<WorkItem> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate potential failure (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Simulated network error');
    }

    const newWorkItem: WorkItem = {
      id: this.getNextId(),
      title: request.title,
      description: request.description,
      status: 'created',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockWorkItems.unshift(newWorkItem); // Add to beginning for newest first
    return newWorkItem;
  }

  async updateWorkItem(request: UpdateWorkItemRequest): Promise<WorkItem> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate potential failure (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Simulated network error');
    }

    const item = mockWorkItems.find(item => item.id === request.id);
    if (!item) {
      throw new Error('Work item not found');
    }

    item.title = request.title;
    item.description = request.description;
    item.updatedAt = new Date().toISOString();

    return item;
  }

  async deleteWorkItem(id: number): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate potential failure (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Simulated network error');
    }

    const index = mockWorkItems.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Work item not found');
    }

    mockWorkItems.splice(index, 1);
  }
}

export const mockWorkItemService = new MockWorkItemService();
