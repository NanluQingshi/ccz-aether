export interface Book {
  id: number;
  title: string;
  author: string;
  cover?: string;
  status: 'want' | 'reading' | 'done';
  rating?: number;
  review?: string;
  category?: string;
  totalPages?: number;
  readPages?: number;
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookRequest {
  title: string;
  author: string;
  cover?: string;
  status: 'want' | 'reading' | 'done';
  rating?: number;
  review?: string;
  category?: string;
  totalPages?: number;
  readPages?: number;
  startedAt?: string;
  finishedAt?: string;
}
