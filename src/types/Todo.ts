export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  isEditing?: boolean;
  loading?: boolean;
}

export enum TodoFilter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}
