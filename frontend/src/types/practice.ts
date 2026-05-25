export interface PracticeLink {
  title: string;
  url: string;
}

export interface Practice {
  id: number;
  category: string;
  categoryIcon: string;
  name: string;
  description: string;
  links: PracticeLink[];
  status: 'todo' | 'in_progress' | 'mastered';
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PracticeRequest {
  category: string;
  categoryIcon: string;
  name: string;
  description?: string;
  links: PracticeLink[];
  status: 'todo' | 'in_progress' | 'mastered';
  sortOrder: number;
}
