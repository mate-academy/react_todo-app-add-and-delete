export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum Status {
  active = 'Active',
  complited = 'Completed',
  all = 'All',
}
