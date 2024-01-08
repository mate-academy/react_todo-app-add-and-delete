import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';

import { Todo } from '../types/Todo';
import { getTodos, addTodo, deleteTodo } from '../api/todos';
import { SortType, ErrorMessages } from './TodosProvider.types';

type TodoContextType = {
  todos: Todo[];
  filteredTodos: Todo[];
  tempTodo: Todo | null,
  filterType: string;
  pending: boolean;
  messageError: string;
  query: string;
  isLoadingTodo: Todo | null;
  status: number[];
  isToggled: boolean;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setFilteredTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setFilterType: React.Dispatch<React.SetStateAction<string>>;
  setPending: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageError: React.Dispatch<React.SetStateAction<string>>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitSent: (event: React.FormEvent<HTMLFormElement>) => void;
  handleDeleteTodo: (id: number) => void;
  setStatus: React.Dispatch<React.SetStateAction<number[]>>
  setIsLoadingTodo: React.Dispatch<React.SetStateAction<Todo | null>>
  handleClearCompleted: () => void;
  setIsToggled: React.Dispatch<React.SetStateAction<boolean>>
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const USER_ID = 12060;

export const TodoProvider: React.FC<{ children: ReactNode }> = (
  { children },
) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState<string>('All');
  const [pending, setPending] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [status, setStatus] = useState<number[]>([]);
  const [isLoadingTodo, setIsLoadingTodo] = useState<Todo | null>(null);
  const [isToggled, setIsToggled] = useState<boolean>(false);

  const fetchTodos = useCallback(
    async () => {
      try {
        const allTodos = await getTodos(USER_ID);

        setTodos(allTodos);
      } catch (error) {
        setMessageError(ErrorMessages.LOAD_TODOS);
      }
    },
    [setTodos, setMessageError],
  );

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleSubmitSent = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!query) {
        setMessageError(ErrorMessages.EMPTY_TITLE);
        setPending(false);

        return;
      }

      try {
        setPending(true);
        setTempTodo({
          id: 0,
          title: query,
          completed: false,
          userId: USER_ID,
        });

        const newTodo = {
          id: 0,
          title: query,
          completed: false,
          userId: USER_ID,
        };
        const addedTodo = await addTodo(newTodo);

        setQuery('');
        setTodos((currentTodo) => [...currentTodo, addedTodo]);
      } catch (error) {
        setMessageError(ErrorMessages.EMPTY_TITLE);
      } finally {
        setMessageError('');
        setPending(false);
        setTempTodo(null);
      }
    },
    [setQuery, setMessageError, query],
  );

  const handleDeleteTodo = useCallback(
    async (id: number) => {
      setStatus([...status, id]);

      try {
        setIsLoadingTodo(todos.find(todo => todo.id === id) || null);

        await deleteTodo(id);
        setTodos(
          currentTodos => currentTodos.filter(todo => todo.id !== id),
        );
      } catch (error) {
        setMessageError(ErrorMessages.DELETE_TODO);
      } finally {
        setStatus([]);
      }
    },
    [todos, status],
  );

  const handleClearCompleted = useCallback(() => {
    setIsToggled(true);

    setTimeout(async () => {
      try {
        const completedTodos = todos.filter((todo) => todo.completed);

        await Promise.all(
          completedTodos.map(async (todo) => {
            await handleDeleteTodo(todo.id);
          }),
        );

        setTodos(
          (currentTodos) => currentTodos.filter((todo) => !todo.completed),
        );
      } catch (error) {
        throw new Error();
      } finally {
        setIsToggled(false);
      }
    }, 500);
  }, [todos, setTodos, setIsToggled, handleDeleteTodo]);

  useMemo(() => {
    switch (filterType) {
      case SortType.ALL:
        setFilteredTodos(todos);
        break;
      case SortType.ACTIVE:
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;
      case SortType.COMPLETED:
        setFilteredTodos(todos.filter(todo => todo.completed));
        break;
      default:
        break;
    }
  }, [filterType, todos, setFilteredTodos]);

  if (messageError) {
    setTimeout(() => {
      setMessageError('');
    }, 3000);
  }

  const value = {
    todos,
    filteredTodos,
    tempTodo,
    filterType,
    pending,
    messageError,
    query,
    isLoadingTodo,
    status,
    isToggled,
    setTodos,
    setFilteredTodos,
    setTempTodo,
    setFilterType,
    setPending,
    setMessageError,
    setQuery,
    handleSubmitSent,
    handleDeleteTodo,
    setStatus,
    setIsLoadingTodo,
    handleClearCompleted,
    setIsToggled,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }

  return context;
};
