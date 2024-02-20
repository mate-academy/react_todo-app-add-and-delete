import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TodoContextTypes } from '../types/TodoContextTypes';
import { Status } from '../types/Status';
import { ErrorsMessage } from '../types/ErrorsMessage';
import { getFilteredTodos } from '../services/getFilteredTodos';
import { getTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import { USER_ID } from '../constants/User';

export const TodoContext = React.createContext<TodoContextTypes>({
  todos: [],
  filteredTodos: [],
  status: Status.All,
  tempTodo: null,
  errorMessage: ErrorsMessage.None,
  updatingTodosIds: [],
  addTodo: () => {},
  deleteTodo: () => {},
  handleSetTempTodo: () => {},
  handleSetErrorMessage: () => {},
  handleUpdatingTodosIds: () => {},
  changeStatus: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState<ErrorsMessage>(
    ErrorsMessage.None,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [updatingTodosIds, setUpdatingTodosIds] = useState<number[]>([]);

  const filteredTodos = getFilteredTodos(todos, status);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorsMessage.Load);
      });
  }, []);

  const handleSetErrorMessage = (newError: ErrorsMessage) => {
    setErrorMessage(newError);
  };

  const changeStatus = (newStatus: Status) => {
    setStatus(newStatus);
  };

  const handleSetTempTodo = (newTodo: Todo | null) => {
    setTempTodo(newTodo);
  };

  const handleUpdatingTodosIds = (id: number | null) => {
    if (id) {
      setUpdatingTodosIds(currentIds => [...currentIds, id]);
    } else {
      setUpdatingTodosIds([]);
    }
  };

  const addTodo = useCallback(
    (newTodo: Todo) => {
      setTodos(currentTodos => [...currentTodos, newTodo]);
    },
    [setTodos],
  );

  const deleteTodo = useCallback(
    (todoDeleteID: number) => {
      setTodos(currentTodos =>
        currentTodos.filter(({ id }) => {
          return id !== todoDeleteID;
        }),
      );
    },
    [setTodos],
  );

  const values = useMemo(
    () => ({
      todos,
      filteredTodos,
      status,
      tempTodo,
      errorMessage,
      updatingTodosIds,
      addTodo,
      deleteTodo,
      handleSetTempTodo,
      handleSetErrorMessage,
      handleUpdatingTodosIds,
      changeStatus,
    }),
    [
      todos,
      filteredTodos,
      status,
      tempTodo,
      errorMessage,
      updatingTodosIds,
      addTodo,
      deleteTodo,
    ],
  );

  return <TodoContext.Provider value={values}>{children}</TodoContext.Provider>;
};
