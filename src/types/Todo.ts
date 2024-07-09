export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum SelectedStatus {
  all = 'All',
  active = 'Active',
  completed = 'Completed',
}
