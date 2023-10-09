import React, { useEffect, useState } from 'react';
import { TodosContextType } from '../types/TodosContextType';
import { Todo } from '../types/Todo';
import { SortType } from '../types/SortType';
import * as postService from '../api/todos';
import { USER_ID } from '../utils/USER_ID';

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  setTodos: () => { },
  errorMessage: '',
  setErrorMessage: () => { },
  preparedTodos: [],
  sortQuery: '',
  setSortQuery: () => {},
  tempTodo: {
    id: 0,
    userId: 0,
    title: '',
    completed: false,
  },
  setTempTodo: () => {},
});

type Props = {
  children: React.ReactNode,
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [sortQuery, setSortQuery] = useState(SortType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    postService.getTodos(USER_ID)
      .then(todosFromServer => {
        setTodos(() => {
          if (todosFromServer.length) {
            return todosFromServer;
          }

          return null;
        });
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const preparedTodos = todos?.filter(todo => {
    switch (sortQuery as SortType) {
      case SortType.Active:
        return !todo.completed;

      case SortType.Completed:
        return todo.completed;

      default:
        return true;
    }
  }) || todos;

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        errorMessage,
        setErrorMessage,
        preparedTodos,
        sortQuery,
        setSortQuery,
        tempTodo,
        setTempTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
