import React, {
  createContext, useEffect, useMemo, useState,
} from 'react';
import { Todo } from '../types/Todo';
import { TodoContext } from '../types/TodosContext';
import { getTodos } from '../api/todos';
import { USER_ID } from '../variables';
import { Status } from '../types/Status';

export const TodosContext = createContext<TodoContext>({
  todos: [],
  setTodos: () => { },
  title: '',
  setTitle: () => { },
  filterField: Status.All,
  setFilterField: () => { },
  errorMessage: '',
  setErrorMessage: () => { },
  tempTodo: null,
  setTempTodo: () => { },
  changedTodos: [],
  setChangedTodos: () => {},
});

type Props = {
  children: React.ReactNode
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [filterField, setFilterField] = useState(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [changedTodos, setChangedTodos] = useState<Todo[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const preparedValue = useMemo(() => ({
    todos,
    setTodos,
    title,
    setTitle,
    filterField,
    setFilterField,
    errorMessage,
    setErrorMessage,
    tempTodo,
    setTempTodo,
    changedTodos,
    setChangedTodos,
  }), [todos,
    title,
    filterField,
    setTodos,
    errorMessage,
    tempTodo,
    changedTodos]);

  return (
    <TodosContext.Provider value={preparedValue}>
      {children}
    </TodosContext.Provider>
  );
};
