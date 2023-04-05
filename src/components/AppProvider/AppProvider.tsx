import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Filters } from '../../types/enums';
import { Todo } from '../../types/Todo';
import { addTodo, getTodos, removeTodo } from '../../api/todos';

const USER_ID = 6816;

interface AppContextType {
  selectedFilter: Filters;
  setSelectedFilter: (filter: Filters) => void;
  todos: Todo[];
  updateTodos: (todos: Todo[]) => void;
  tempTodo: Todo | null;
  addTempTodo: (todo: string) => Promise<void>;
  userId: number;
  error: string;
  hideNotification: boolean;
  setHideNotification: (hide: boolean) => void;
  isTodosLoading: boolean;
  removeTodoById: (id: number) => Promise<void>;
  triggerRemoveCompleted: boolean;
  setTriggerRemoveCompleted: (triggered: boolean) => void;
}

export const AppContext = createContext<AppContextType>(
  {
    selectedFilter: Filters.All,
    setSelectedFilter: () => {},
    todos: [],
    updateTodos: () => {},
    tempTodo: null,
    addTempTodo: async () => {},
    userId: USER_ID,
    error: '',
    hideNotification: true,
    setHideNotification: () => {},
    isTodosLoading: false,
    removeTodoById: async () => {},
    triggerRemoveCompleted: false,
    setTriggerRemoveCompleted: () => {},
  },
);

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(Filters.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [userId] = useState(USER_ID);
  const [error, setError] = useState('');
  const [hideNotification, setHideNotification] = useState(true);
  const [isTodosLoading, setIsTodosLoading] = useState(false);
  const [triggerRemoveCompleted, setTriggerRemoveCompleted] = useState(false);

  useEffect(() => {
    if (triggerRemoveCompleted) {
      setTriggerRemoveCompleted(false);
    }
  }, [triggerRemoveCompleted]);

  const updateTodos = useCallback((newTodos: Todo[]) => {
    setTodos(newTodos);
  }, []);

  const addTempTodo = useCallback(async (title: string) => {
    const todo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    try {
      setError('');
      setHideNotification(true);
      setTempTodo(todo);
      const newTodo = await addTodo(todo);

      setTodos(prevTodos => ([
        ...prevTodos,
        newTodo,
      ]));
    } catch (err) {
      setHideNotification(false);
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  }, []);

  const removeTodoById = useCallback(async (id: number) => {
    try {
      await removeTodo(id);
    } catch (err) {
      setError('Unable to delete a todo');
    }

    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  const loadTodosFromServer = useCallback(async () => {
    try {
      setIsTodosLoading(true);
      setError('');
      setHideNotification(true);
      const result = await getTodos(userId);

      updateTodos(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setHideNotification(false);
        setTimeout(setHideNotification, 3000, [true]);
      }
    } finally {
      setIsTodosLoading(false);
    }
  }, [updateTodos]);

  useEffect(() => {
    loadTodosFromServer();
  }, []);

  return (
    <AppContext.Provider
      value={{
        todos,
        selectedFilter,
        setSelectedFilter,
        updateTodos,
        tempTodo,
        addTempTodo,
        userId,
        error,
        hideNotification,
        setHideNotification,
        isTodosLoading,
        removeTodoById,
        triggerRemoveCompleted,
        setTriggerRemoveCompleted,
      }}
    >
      { children }
    </AppContext.Provider>
  );
};
