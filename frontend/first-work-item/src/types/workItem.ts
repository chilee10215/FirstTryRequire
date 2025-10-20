export interface WorkItem {
  id: number;
  title: string;
  description?: string;
  status: WorkItemStatus;
  createdAt: string;
  updatedAt?: string;
}

export type WorkItemStatus = 'created' | 'pending' | 'confirmed';

export interface WorkItemUpdateRequest {
  workItemIds: number[];
  status: WorkItemStatus;
}

export interface WorkItemResponse {
  workItems: WorkItem[];
  totalCount: number;
}
