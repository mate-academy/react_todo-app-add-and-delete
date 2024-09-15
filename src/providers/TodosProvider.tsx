import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { USER_ID, deleteTodo, getTodos, postTodo } from '../api/todos';
import { TodoError } from '../types/TodoError';

export type Filter = 'all' | 'completed' | 'active';

type TodosContextT = {
  allTodos: Todo[];
  activeTodos: Todo[];
  completedTodos: Todo[];
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  todosInUpdate: number[];
  error: TodoError | null;
  filter: Filter;
  isLoading: boolean;
  setFilter: (filter: Filter) => void;
  setError: (error: TodoError | null) => void;
  onAddTodo: (title: string) => void;
  onDeleteTodo: (...ids: number[]) => void;
};

const TodosContext = createContext<TodosContextT>({
  allTodos: [],
  filteredTodos: [],
  error: null,
  filter: 'all',
  isLoading: false,
  setFilter: () => {},
  setError: () => {},
  onAddTodo: () => {},
  onDeleteTodo: () => {},
  activeTodos: [],
  completedTodos: [],
  tempTodo: null,
  todosInUpdate: [],
});

export const TodosProvider: FC<PropsWithChildren> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<TodoError | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [isLoading, setIsloading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosInUpdate, setTodosInUpdate] = useState<number[]>([]);

  useEffect(() => {
    setIsloading(true);
    getTodos()
      .then(data => setTodos(data))
      .catch(() => setError(TodoError.LOAD))
      .finally(() => setIsloading(false));
  }, []);

  const activeTodos = useMemo(() => todos.filter(t => !t.completed), [todos]);
  const completedTodos = useMemo(() => todos.filter(t => t.completed), [todos]);

  const getFilteredTodos = () => {
    switch (filter) {
      case 'completed':
        return completedTodos;
      case 'active':
        return activeTodos;
      case 'all':
      default:
        return todos;
    }
  };

  const onAddTodo = useCallback((title: string) => {
    if (!title) {
      setError(TodoError.EMPTY_TITLE);
    } else {
      setIsloading(true);
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      });
      setTodosInUpdate(prev => [...prev, 0]);
      postTodo(title, false)
        .then(todo => setTodos(prev => [...prev, todo]))
        .catch(() => setError(TodoError.ADD))
        .finally(() => {
          setTempTodo(null);
          setTodosInUpdate(prev => prev.filter(id => id !== 0));
          setIsloading(false);
        });
    }
  }, []);

  const onDeleteTodo = useCallback((...ids: number[]) => {
    setIsloading(true);
    setTodosInUpdate(prev => [...prev, ...ids]);
    Promise.all(
      ids.map(id =>
        deleteTodo(id)
          .then(() => setTodos(prev => prev.filter(t => t.id !== id)))
          .finally(() =>
            setTodosInUpdate(prev => prev.filter(tId => tId !== id)),
          ),
      ),
    )
      .catch(() => setError(TodoError.DELETE))
      .finally(() => setIsloading(false));
  }, []);

  const value = {
    allTodos: todos,
    activeTodos,
    completedTodos,
    tempTodo,
    filteredTodos: getFilteredTodos(),
    todosInUpdate,
    error,
    isLoading,
    setError,
    filter,
    setFilter,
    onAddTodo,
    onDeleteTodo,
  };

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};

export const useTodos = () => useContext(TodosContext);
