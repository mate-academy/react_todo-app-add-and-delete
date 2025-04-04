import React, { createContext, useContext } from 'react';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';
import { useFilter } from '../hooks/useFilter';
import { useTodos } from '../hooks/useTodos';

interface TodoContextType {
  todos: Todo[];
  filter: FilterType;
  isLoading: boolean;
  loadingTodos: number[];
  tempTodo: Todo | null;
  errorMessage: string;
  activeTodosCount: number;
  completedTodosCount: number;
  hasTodos: boolean;
  setFilter: (filter: FilterType) => void;
  setErrorMessage: (message: string) => void;
  handleSubmit: (title: string) => Promise<boolean>;
  handleDelete: (todoId: number) => Promise<boolean>;
  handleToggle: (todoId: number) => Promise<void>;
  handleUpdate: (todoId: number, newTitle: string) => Promise<void>;
  handleClearCompleted: () => Promise<boolean>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodoContext = () => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }

  return context;
};

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { filter, setFilter } = useFilter();
  const {
    todos,
    isLoading,
    loadingTodos,
    tempTodo,
    errorMessage,
    setErrorMessage,
    handleSubmit,
    handleDelete,
    handleToggle,
    handleUpdate,
    handleClearCompleted,
    activeTodosCount,
    completedTodosCount,
    hasTodos,
  } = useTodos(filter);

  const value = {
    todos,
    filter,
    isLoading,
    loadingTodos,
    tempTodo,
    errorMessage,
    activeTodosCount,
    completedTodosCount,
    hasTodos,
    setFilter,
    setErrorMessage,
    handleSubmit,
    handleDelete,
    handleToggle,
    handleUpdate,
    handleClearCompleted,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
