export interface HandleAddedTodo {
  userId: number | undefined,
  title: string;
  completed: boolean;
}
