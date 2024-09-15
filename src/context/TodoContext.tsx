import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TodoContextType } from '../types/TodoContextType';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import { getFilteredTodos } from '../services/getFilteredTodos';
import { getTodos } from '../api/todos';
import { USER_ID } from '../constants/constans';
import { ErrorMessage } from '../types/ErrorMessages';

export const TodoContext = React.createContext<TodoContextType>({
  todos: [],
  filteredTodos: [],
  status: Status.All,
  tempTodo: null,
  errorMessage: ErrorMessage.None,
  updatingTodosIds: [],
  addTodo: () => {},
  deleteTodo: () => {},
  changeStatus: () => {},
  handleSetTempTodo: () => {},
  handleSetErrorMessage: () => {},
  handleUpdatingTodosIds: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  // eslint-disable-next-line prettier/prettier, max-len
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.None,
  );
  const [updatingTodosIds, setUpdatingTodosIds] = useState<number[]>([]);
  const filteredTodos = getFilteredTodos(todos, status);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
      });
  }, []);

  const addTodo = useCallback(
    (newTodo: Todo) => {
      setTodos(currentTodos => [...currentTodos, newTodo]);
    },
    [setTodos],
  );

  const deleteTodo = useCallback(
    (todoToDeleteID: number) => {
      setTodos(currentTodos =>
        currentTodos.filter(({ id }) => {
          return id !== todoToDeleteID;
        }),
      );
    },
    [setTodos],
  );

  const changeStatus = (newStatus: Status) => {
    setStatus(newStatus);
  };

  const handleSetTempTodo = (newTodo: Todo | null) => {
    setTempTodo(newTodo);
  };

  const handleSetErrorMessage = (newError: ErrorMessage) => {
    setErrorMessage(newError);
  };

  const handleUpdatingTodosIds = (id: number | null) => {
    if (id) {
      setUpdatingTodosIds(currentIds => [...currentIds, id]);
    } else {
      setUpdatingTodosIds([]);
    }
  };

  const todosValues = useMemo(
    () => ({
      todos,
      filteredTodos,
      status,
      errorMessage,
      tempTodo,
      updatingTodosIds,
      addTodo,
      deleteTodo,
      changeStatus,
      handleSetErrorMessage,
      handleSetTempTodo,
      handleUpdatingTodosIds,
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

  return (
    <TodoContext.Provider value={todosValues}>{children}</TodoContext.Provider>
  );
};
