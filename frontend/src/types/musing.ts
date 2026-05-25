export interface Musing {
  id: number;
  content: string;
  type: 'idea' | 'todo';
  done: number;
  createdAt: string;
  updatedAt: string;
}

export interface MusingRequest {
  content: string;
  type: 'idea' | 'todo';
}
