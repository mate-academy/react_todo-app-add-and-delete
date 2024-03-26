import { createContext } from 'react';
import { TodoContext } from '../types/TodoContext';
import { useState } from 'react';
import { Errors } from '../types/Errors';
import { FilterTodos } from '../types/FilterTodos';
import { Todo } from '../types/Todo';

export const TodosContext = createContext<TodoContext | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export const TodosContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterSelected, setFilterSelected] = useState<FilterTodos>(
    FilterTodos.all,
  );
  const [error, setError] = useState<Errors>(Errors.default);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsloading] = useState(true);

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const contextValues = {
    todos,
    setTodos,
    isLoading,
    setIsloading,
    completedTodos,
    activeTodos,
    filterSelected,
    setFilterSelected,
    error,
    setError,
    loadingTodoIds,
    setLoadingTodoIds,
    tempTodo,
    setTempTodo,
  };

  return (
    <TodosContext.Provider value={contextValues}>
      {children}
    </TodosContext.Provider>
  );
};
