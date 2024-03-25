import { Filter } from './Filter';
import { Todo } from './Todo';

export interface State {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  handleError: (error: string) => void;
  isAllDeleted: boolean;
  setIsAllDeleted: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleteTodo: (todoId: number) => void;
  loadingTodosIDs: number[];
  setLoadingTodosIDs: React.Dispatch<React.SetStateAction<number[]>>;
}
