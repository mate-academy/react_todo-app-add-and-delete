export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodoContextType = {
  todo: Todo[];
  tempTodo: Todo | null;
  processingTodoIds: number[];
  isCreatingTodo: boolean;
  handleSelected: (id: number) => void;
  handleRemove: (id: number) => Promise<void>;
  handleFilterAll: () => void;
  handleActive: () => void;
  handleCompleted: () => void;
  filteredTodo: Todo[];
  filter: string;
  handleCreateTodo: (title: string) => Promise<boolean>;
  handleRemoveCompleted: () => Promise<void>;
  setTodo: React.Dispatch<React.SetStateAction<Todo[]>>;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
};
