import React, { useMemo, useState } from 'react';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { TodosContextType } from './types/TodosContext';
import { ErrorMessage } from './types/ErrorMessage';

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  setTodos: () => {},
  visibleTodos: [],
  filter: Status.ALL,
  setFilter: () => { },
  isChecked: false,
  setIsChecked: () => {},
  errorMessage: ErrorMessage.DEFAULT,
  setErrorMessage: () => {},
  isProcessing: [],
  setIsProcessing: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [filter, setFilter] = useState(Status.ALL);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.DEFAULT);
  const [isProcessing, setIsProcessing] = useState<number[]>([]);

  const visibleTodos = useMemo(() => {
    if (filter === Status.ACTIVE) {
      return todos.filter(todo => !todo.completed);
    }

    if (filter === Status.COMPLETED) {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  }, [filter, todos]);

  const value = {
    todos,
    setTodos,
    visibleTodos,
    isChecked,
    setIsChecked,
    filter,
    setFilter,
    errorMessage,
    setErrorMessage,
    isProcessing,
    setIsProcessing,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
