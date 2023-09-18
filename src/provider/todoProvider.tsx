import {
  createContext, useContext, useEffect, useState,
} from 'react';
import {
  Errors, Props, TodoContextType,
} from './types';
import { getTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';

const TodoContext = createContext<TodoContextType | undefined>(undefined); // Zmiana na TodoContext
const USER_ID = 11433;

export const ToDoProvider = ({ children }: Props) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Errors | null>(null);
  const [filterTodos, setFilterTodos]
    = useState<FilterType>('all');

  const handleShowError = (err: Errors) => {
    setError(err);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
      })
      .catch(() => {
        handleShowError(Errors.Update);
      });
  }, [todos]);
  const handleSetFilterTodos = (filterType: FilterType) => {
    setFilterTodos(filterType);
  };

  const closeErrorMessage = () => {
    setError(null);
  };

  return (
    <TodoContext.Provider value={{
      todos,
      error,
      filterTodos,
      handleShowError,
      handleSetFilterTodos,
      closeErrorMessage,
    }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = (): TodoContextType => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('useTodo must be used within a ToDoProvider');
  }

  return context;
};
