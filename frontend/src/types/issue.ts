export interface Issue {
  id: number;
  title: string;
  description?: string;
  status: 0 | 1 | 2;
  priority: 0 | 1 | 2;
  createdAt: string;
  updatedAt: string;
}

export interface IssueRequest {
  title: string;
  description?: string;
  priority: 0 | 1 | 2;
}
