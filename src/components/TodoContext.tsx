import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { Context } from '../types/Context';
import { Status } from '../types/Status';
import { ErrorType } from '../types/ErrorType';
import * as todosService from '../api/todos';

const USER_ID = 11941;

const initialState:Context = {
  todos: [],
  setTodos: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  addTodo: async () => {},
  deleteTodo: async () => {},
  filter: Status.All,
  setFilter: () => {},
  error: ErrorType.None,
  setError: () => {},
  isLoading: false,
  setIsLoading: () => {},
};

export const TodoContext = React.createContext<Context>(initialState);

type Props = {
  children: React.ReactNode,
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState(Status.All);
  const [error, setError] = useState<ErrorType>(ErrorType.None);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    todosService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(ErrorType.LoadError))
      .finally(() => {
        const timer = setTimeout(() => {
          setError(ErrorType.None);
        }, 3000);

        return () => clearTimeout(timer);
      });
  }, []);

  const deleteTodo = (todoId: number) => {
    setError(ErrorType.None);

    setTodos(todos.filter(todo => todo.id !== todoId));
    todosService.deleteTodo(todoId)
      .catch(() => {
        setTodos(todos);
        setError(ErrorType.DeleteTodoError);
      })
      .finally(() => {
        const timer = setTimeout(() => {
          setError(ErrorType.None);
        }, 3000);

        return () => clearTimeout(timer);
      });
  };

  const addTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
    setError(ErrorType.None);

    setTempTodo({
      id: 0, userId, title, completed,
    });

    setIsLoading(true);

    return todosService.createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
      })
      .catch((err) => {
        setError(ErrorType.AddTodoError);
        throw err;
      })
      .finally(() => {
        setTempTodo(null);
        const timer = setTimeout(() => {
          setError(ErrorType.None);
        }, 3000);

        return () => clearTimeout(timer);
      });
  };

  const value = {
    todos,
    setTodos,
    tempTodo,
    setTempTodo,
    addTodo,
    deleteTodo,
    filter,
    setFilter,
    error,
    setError,
    isLoading,
    setIsLoading,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
