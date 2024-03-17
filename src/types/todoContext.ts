import { Todo } from './Todo';

export interface TodoContext {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filter: string;
  setFilter: (text: string) => void;
  errorMessage: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  todosCounter: () => Todo[];
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  leftCount: number,
  setLeftCount: React.Dispatch<React.SetStateAction<number>>,
  completedCount: number,
  setCompletedCount: React.Dispatch<React.SetStateAction<number>>,
  loading: boolean,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  activeItemId: number | null,
  setActiveItemId: React.Dispatch<React.SetStateAction<number | null>>,
}
