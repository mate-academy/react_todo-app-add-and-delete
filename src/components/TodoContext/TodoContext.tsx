import React, {
  useMemo, useState, useEffect, useCallback,
} from 'react';

import { Todo } from '../../types/Todo';
import { FilterStatus } from '../../types/FilterStatus';
import { ErrorMessage } from '../../types/Error';
import { USER_ID } from '../../utils/UserID';
import * as todoService from '../../api/todos';

type TodoContext = {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  filter: FilterStatus,
  setFilter: (status: FilterStatus) => void,
  filterTodos: () => Todo[],
  errorMessage: ErrorMessage,
  setErrorMessage: (message: ErrorMessage) => void,
  tempTodo: Todo | null,
  setTempTodo: (todo: Todo | null) => void,
  addCurrentTodo: (todo: Omit<Todo, 'id'>) => Promise<void>,
  processingIds: number[],
  setProcessingIds: (ids: number[]) => void,
  removeTodo: (todoId: number) => Promise<void>,
  isLoading: boolean,
  setIsLoading: (arg: boolean) => void,
};

type Props = {
  children: React.ReactNode,
};

export const TodosContext = React.createContext<TodoContext>({
  todos: [],
  setTodos: () => {},
  filter: FilterStatus.ALL,
  setFilter: () => {},
  filterTodos: () => [],
  errorMessage: ErrorMessage.None,
  setErrorMessage: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  addCurrentTodo: async () => {},
  processingIds: [],
  setProcessingIds: () => {},
  removeTodo: async () => {},
  isLoading: false,
  setIsLoading: () => {},
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterStatus.ALL);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.None);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.Load));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      window.setTimeout(() => {
        setErrorMessage(ErrorMessage.None);
      }, 3000);
    }
  }, [errorMessage]);

  const addCurrentTodo = useCallback((
    { title, completed, userId }: Omit<Todo, 'id'>,
  ) => {
    setTempTodo({
      id: 0,
      title,
      completed,
      userId,
    });

    return todoService.addTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
      })
      .catch((error) => {
        setErrorMessage(ErrorMessage.Add);

        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  }, []);

  const removeTodo = useCallback((todoId: number) => {
    setIsLoading(true);
    setErrorMessage(ErrorMessage.None);
    setProcessingIds(prev => [...prev, todoId]);

    return todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setIsLoading(false);
        setErrorMessage(ErrorMessage.Delete);
        setProcessingIds([]);
      })
      .finally(() => {
        setIsLoading(false);
        setProcessingIds(prev => prev.filter(id => id !== todoId));
      });
  }, []);

  const filterTodos = () => {
    switch (filter) {
      case FilterStatus.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilterStatus.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const todoState = useMemo(() => ({
    todos,
    setTodos,
    filterTodos,
    filter,
    setFilter,
    errorMessage,
    setErrorMessage,
    tempTodo,
    setTempTodo,
    addCurrentTodo,
    processingIds,
    setProcessingIds,
    removeTodo,
    isLoading,
    setIsLoading,
  }), [
    todos,
    tempTodo,
    processingIds,
    isLoading,
    filter,
    errorMessage,
  ]);

  return (
    <TodosContext.Provider value={todoState}>
      {children}
    </TodosContext.Provider>
  );
};
