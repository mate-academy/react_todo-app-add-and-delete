export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type OnTodoChange = <K extends keyof Todo>(
  todo: Todo,
  field: K,
  value: Todo[K],
) => void;
