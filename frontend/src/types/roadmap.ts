export interface RoadmapItem {
  id: number;
  groupLabel: string;
  groupIcon?: string;
  name: string;
  description?: string;
  status: 'done' | 'planned';
  priority?: 'high' | 'medium' | 'low';
  sortOrder: number;
  createdAt: string;
}

export interface RoadmapItemRequest {
  groupLabel: string;
  groupIcon?: string;
  name: string;
  description?: string;
  status: 'done' | 'planned';
  priority?: 'high' | 'medium' | 'low' | '';
  sortOrder?: number;
}
