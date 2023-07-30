import { Todo } from './Todo';

export interface ContextType {
  userId: number,
  todos: Todo[],
  setTodos: (val: Todo[]) => void,
  todoTitle: string,
  setTodoTitle: (val: string) => void,
  filterType: string,
  setFilterType: (val: string) => void,
  loading: boolean,
  setLoading: (val: boolean) => void,
  isError: string,
  setIsError: (val: string) => void,
}
