export interface Todo {
  userId: number;
  title: string;
  completed: boolean;
}

export interface TempTodo {
  userId: number;
  title: string;
  completed: boolean;
  id: number;
}

export type TodoContextType = {
  todo: Todo[];
  handleSelected: (id: number) => void;
  handleRemove: (id: number) => void;
  handleFilterAll: () => void;
  handleActive: () => void;
  handleCompleted: () => void;
  visibleTodos: (todo: Todo[], filter: string) => Todo[];
  filter: string;
  handleRemoveCompleted: () => void;
  setTodo: (todos: Todo[]) => void;
  tempTodo: TempTodo[] | null;
  deletingIds: number[];
};

export interface Props {
  todo?: TempTodo | null;
  isLoaderRemove: boolean;
  filteredTodo: TempTodo[];
  isDeleting?: boolean;
}
