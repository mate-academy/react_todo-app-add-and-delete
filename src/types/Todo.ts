export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type EditableField = { title: string } | { completed: boolean };
