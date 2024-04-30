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

export const errors = {
  load: {
    message: 'Unable to load todos',
  },
  add: {
    message: 'Unable to add a todo',
  },
  delete: {
    message: 'Unable to delete a todo',
  },
  update: {
    message: 'Unable to update a todo',
  },
  empty: {
    message: 'Title should not be empty',
  },
};

export type Filter = 'all' | 'completed' | 'active';

export type ErrorType = keyof typeof errors;

type TodosContextT = {
  allTodos: Todo[];
  activeTodos: Todo[];
  completedTodos: Todo[];
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  error: ErrorType | null;
  filter: Filter;
  isLoading: boolean;
  setFilter: (filter: Filter) => void;
  setError: (error: ErrorType | null) => void;
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
});

export const TodosProvider: FC<PropsWithChildren> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorType | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [isLoading, setIsloading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    setIsloading(true);
    getTodos()
      .then(data => setTodos(data))
      .catch(() => setError('load'))
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
      setError('empty');
    } else {
      setIsloading(true);
      setTempTodo({ id: 0, userId: USER_ID, title, completed: false });
      postTodo(title, false)
        .then(todo => setTodos(prev => [...prev, todo]))
        .catch(() => setError('add'))
        .finally(() => {
          setTempTodo(null);
          setIsloading(false);
        });
    }
  }, []);

  const onDeleteTodo = useCallback((...ids: number[]) => {
    setIsloading(true);
    Promise.all(
      ids.map(id =>
        deleteTodo(id).then(() =>
          setTodos(prev => prev.filter(t => t.id !== id)),
        ),
      ),
    )
      .catch(() => setError('delete'))
      .finally(() => setIsloading(false));
  }, []);

  const value = {
    allTodos: todos,
    activeTodos,
    completedTodos,
    tempTodo,
    filteredTodos: getFilteredTodos(),
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
