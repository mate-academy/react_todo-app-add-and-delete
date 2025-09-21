export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  isTemp?: boolean;
  pendingDeletion?: boolean;
}
export enum FilterType {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}
