export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface CommonTodosProps {
  removesTodo: (todosIds: number[]) => void;
  loadingTodos: number[];
}
