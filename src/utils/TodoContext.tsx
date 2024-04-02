import React, { createContext, useContext, useEffect, useState } from 'react';
import { TodosContextType } from '../types/TodosContextTypes';
import { Todo } from '../types/Todo';
import { ErrorMessages } from '../types/ErrorMessages';
import { FilterOptions } from '../types/FilterOptions';
import { deleteTodo, getTodos } from '../api/todos';

const TodosContext = createContext<TodosContextType>({
  todos: [],
  setTodos: () => {},
  errorMessage: null,
  setErrorMessage: () => {},
  isLoading: false,
  setIsLoading: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  filter: FilterOptions.All,
  setFilter: () => {},
  clearError: () => {},
  title: '',
  setTitle: () => {},
  showError: () => {},
  loadingTodosIds: [],
  setLoadingTodosIds: () => {},
  removeTodo: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<FilterOptions>(FilterOptions.All);
  const [title, setTitle] = useState('');
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);

  const clearError = () => setErrorMessage(null);

  const showError = (error: ErrorMessages) => {
    setErrorMessage(error);

    setTimeout(() => {
      clearError();
    }, 3000);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
      } catch {
        showError(ErrorMessages.LoadTodos);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const removeTodo = (id: number) => {
    setIsLoading(true);
    setLoadingTodosIds(prevTodosIds => [...prevTodosIds, id]);
    deleteTodo(id)
      .then(() =>
        setTodos(prevTodos =>
          prevTodos.filter((todoItem: Todo) => todoItem.id !== id),
        ),
      )
      .catch(() => showError(ErrorMessages.DeleteTodo))
      .finally(() => {
        setLoadingTodosIds(prevTodosIds =>
          prevTodosIds.filter(todoId => todoId !== 0),
        );
        setIsLoading(false);
      });
  };

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        errorMessage,
        setErrorMessage,
        isLoading,
        setIsLoading,
        tempTodo,
        setTempTodo,
        filter,
        setFilter,
        clearError,
        title,
        setTitle,
        showError,
        loadingTodosIds,
        setLoadingTodosIds,
        removeTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => useContext(TodosContext);
