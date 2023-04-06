import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Filters } from '../../types/enums';
import { Todo } from '../../types/Todo';
import { addTodo, getTodos, removeTodo } from '../../api/todos';
import { USER_ID } from '../../utils/constants';

interface AppContextType {
  selectedFilter: Filters;
  setSelectedFilter: (filter: Filters) => void;
  todos: Todo[];
  updateTodos: (todos: Todo[]) => void;
  tempTodo: Todo | null;
  addTempTodo: (todo: string) => Promise<void>;
  errorMessage: string;
  hideNotification: boolean;
  setHideNotification: (hide: boolean) => void;
  isTodosLoading: boolean;
  removeTodoById: (id: number) => Promise<void>;
  arrayOfTodosToRemove: Todo[];
  setArrayOfTodosToRemove: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export const AppContext = createContext<AppContextType>(
  {
    selectedFilter: Filters.All,
    setSelectedFilter: () => {},
    todos: [],
    updateTodos: () => {},
    tempTodo: null,
    addTempTodo: async () => {},
    errorMessage: '',
    hideNotification: true,
    setHideNotification: () => {},
    isTodosLoading: false,
    removeTodoById: async () => {},
    arrayOfTodosToRemove: [],
    setArrayOfTodosToRemove: () => {},
  },
);

export const useAppContext = () => useContext(AppContext);

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(Filters.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [hideNotification, setHideNotification] = useState(true);
  const [isTodosLoading, setIsTodosLoading] = useState(false);
  const [arrayOfTodosToRemove, setArrayOfTodosToRemove] = useState<Todo[]>([]);

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
      setErrorMessage('');
      setHideNotification(true);
      setTempTodo(todo);
      const newTodo = await addTodo(todo);

      setTodos(prevTodos => ([
        ...prevTodos,
        newTodo,
      ]));
    } catch {
      setHideNotification(false);
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  }, []);

  const removeTodoById = useCallback(async (id: number) => {
    try {
      await removeTodo(id);
    } catch {
      setErrorMessage('Unable to delete a todo');
    }

    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  const loadTodosFromServer = useCallback(async () => {
    try {
      setIsTodosLoading(true);
      setErrorMessage('');
      setHideNotification(true);
      const result = await getTodos(USER_ID);

      updateTodos(result);
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
        setHideNotification(false);
        setTimeout(setHideNotification, 3000, [true]);
      }
    } finally {
      setIsTodosLoading(false);
    }
  }, [updateTodos]);

  useEffect(() => {
    Promise.all(arrayOfTodosToRemove.map(
      todo => removeTodoById(todo.id),
    ))
      .then(() => setArrayOfTodosToRemove([]));
  }, [arrayOfTodosToRemove]);

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
        errorMessage,
        hideNotification,
        setHideNotification,
        isTodosLoading,
        removeTodoById,
        arrayOfTodosToRemove,
        setArrayOfTodosToRemove,
      }}
    >
      { children }
    </AppContext.Provider>
  );
};
