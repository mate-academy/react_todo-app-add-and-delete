import { Todo } from './Todo';

export type TodosContextType = {
  todos: Todo[],
  error: string,
  resetError: () => void,
  addTodo: (title: string) => void,
  removeTodo: (todoId: number) => void,
  handleSetError: (errorType: string) => void,
  disabledInput: boolean,
  tempTodo: Todo | null,
  isLoading: boolean,
};
