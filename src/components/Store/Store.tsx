import React, { useRef } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { USER_ID, createTodos, deleteTodos, getTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { FilterBy } from '../../types/FilterBy';

type TodoContextType = {
  filteredTodos: Todo[];
  setTodos: (todo: Todo[]) => void;
  errorMessage: string;
  setErrorMessage: (textError: string) => void;
  filter: FilterBy;
  setFilter: (filter: FilterBy) => void;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo | null) => void;
  isLoading: boolean;
  setIsLoading: (type: boolean) => void;
  query: string;
  setQuery: (text: string) => void;
  handleChangeQuery: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  deleteData: (userId: number) => void;
  handleClearCompleted: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(FilterBy.ALL);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    const todo = await getTodos();

    try {
      setTodos(todo);
    } catch {
      setErrorMessage('Unable to load todos');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query.trim()) {
      setErrorMessage('Title should not be empty');
    }

    try {
      const newTodo = {
        userId: USER_ID,
        title: query.trim(),
        completed: false,
      };

      setTempTodo({
        id: 0,
        ...newTodo,
      });

      const response = await createTodos(newTodo);

      setTodos(prev => [...prev, response]);
      setQuery('');
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const deleteData = async (userId: number) => {
    setIsLoading(true);

    try {
      await deleteTodos(userId);
      setTodos(prev => prev.filter(todo => todo.id !== userId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCompleted = () => {
    setTodos(prev =>
      prev.filter(todo => {
        if (todo.completed) {
          deleteTodos(todo.id);
        }
      }),
    );
  };

  const filteredTodos = useMemo(() => {
    let preparedTodos = [...todos];

    switch (filter) {
      case FilterBy.ACTIVE:
        preparedTodos = preparedTodos.filter(todo => !todo.completed);
        break;
      case FilterBy.COMPLETED:
        preparedTodos = preparedTodos.filter(todo => todo.completed);
        break;
      default:
        return preparedTodos;
    }

    return preparedTodos;
  }, [todos, filter]);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    loadData();
    inputRef.current?.focus();
  }, [todos]);

  const contextValue = useMemo(
    () => ({
      todos,
      errorMessage,
      filter,
      setFilter,
      filteredTodos,
      setTodos,
      setErrorMessage,
      tempTodo,
      setTempTodo,
      isLoading,
      setIsLoading,
      query,
      setQuery,
      handleChangeQuery,
      handleSubmit,
      deleteData,
      handleClearCompleted,
      inputRef,
    }),
    [todos, errorMessage, filter, filteredTodos, tempTodo, isLoading, query],
  );

  return (
    <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);

  if (context === undefined) {
    throw new Error('useTodos must be used within a TodosProvider');
  }

  return context;
};

export default TodoContext;
