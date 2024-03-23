import React, { useEffect } from 'react';

import { deleteTodo, getTodos } from '../api/todos';
import { wait } from '../utils/fetchClient';
import { Filter, State, Todo } from '../types';

const initialTodos: Todo[] = [];

export const TodosContext = React.createContext<State>({
  todos: initialTodos,
  setTodos: () => {},
  filter: Filter.All,
  setFilter: () => {},
  error: '',
  setError: () => {},
  isLoading: false,
  setIsLoading: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  handleError: () => {},
  isAllDeleted: false,
  setIsAllDeleted: () => {},
  onDeleteTodo: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = React.useState<Todo[]>(initialTodos);
  const [filter, setFilter] = React.useState<Filter>(Filter.All);
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [tempTodo, setTempTodo] = React.useState<Todo | null>(null);
  const [isAllDeleted, setIsAllDeleted] = React.useState(false);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);

    wait(3000).then(() => {
      setError('');
    });
  };

  const onDeleteTodo = (todoId: number) => {
    setIsLoading(true);

    deleteTodo(todoId)
      .then(() => {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        handleError('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
      } catch {
        handleError('Unable to load todos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const value = {
    todos,
    setTodos,
    filter,
    setFilter,
    error,
    setError,
    isLoading,
    setIsLoading,
    tempTodo,
    setTempTodo,
    handleError,
    isAllDeleted,
    setIsAllDeleted,
    onDeleteTodo,
  };

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
