import { Todo } from './Todo';

export interface AppContextType {
  userId: number,
  todos: Todo[],
  setTodos: (val: Todo[]) => void,
  todoTitle: string,
  setTodoTitle: (val: string) => void,
  filterType: string,
  setFilterType: (val: string) => void,
  loading: boolean,
  setLoading: (val: boolean) => void,
  errorType: string,
  setErrorType: (val: string) => void,
  processing: number[],
  setProcessing: React.Dispatch<React.SetStateAction<number[]>>,
  editTodoId: number,
  setEditTodoId: (val: number) => void,
}
