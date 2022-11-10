export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum FieldForSorting {
  All,
  Active,
  Completed,
}
