import React, { useEffect, useMemo, useState } from 'react';
import { TodosContext } from '../types/TodosContext';
import { Filter } from '../types/Filter';
import { getTodos } from '../api/todos';
import { Todo } from '../types/Todo';

const initiatTodos: Todo[] = [];

export const TodoContext = React.createContext<TodosContext>({
  todos: initiatTodos,
  setTodos: () => { },
  filter: Filter.Active,
  setFilter: () => { },
  errorMessage: '',
  setErrorMessage: () => { },
  USER_ID: 11947,
});

interface Props {
  children: React.ReactNode;
}

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const USER_ID = 11947;
  const [todos, setTodos] = useState(initiatTodos);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getTodos(USER_ID).then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const value = useMemo(() => ({
    todos,
    setTodos,
    filter,
    setFilter,
    errorMessage,
    setErrorMessage,
    USER_ID,
  }), [todos, filter, errorMessage]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
