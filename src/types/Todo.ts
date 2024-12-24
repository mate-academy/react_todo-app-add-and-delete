export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TypeTodoList = {
  filteredTodoList: Todo[];
  deletingTodos: number[];
  handleToggleCompletion: (numb: number) => void;
  handleDeleteTodo: (numb: number) => void;
  tempTodo?: Todo | null;
};
