/* eslint-disable max-len */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { TodoContextType } from '../../types/TodoContextType';
import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';
import { getFilteredTodos } from '../../services/getFilteredTodos';
import { getTodos } from '../../api/todos';
import { USER_ID } from '../../constants/UserId';
import { ErrorMessage } from '../../types/ErrorMessage';

export const TodoContext = React.createContext<TodoContextType>({
  todos: [],
  filteredTodos: [],
  status: Status.All,
  tempTodo: null,
  errorMessage: ErrorMessage.None,
  updatingTodosIds: [],
  addTodo: () => {},
  deleteTodo: () => {},
  handleSetTempTodo: () => {},
  handleSetErrorMessage: () => {},
  handleUpdatingTodosIds: () => {},
  changeStatus: () => {},
});

type Props = {
  children: React.ReactNode,
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(ErrorMessage.None);
  const [updatingTodosIds, setUpdatingTodosIds] = useState<number[]>([]);
  const filteredTodos = getFilteredTodos(todos, status);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
      });
  }, []);

  const addTodo = useCallback((newTodo: Todo) => {
    setTodos(currentTodos => [...currentTodos, newTodo]);
  }, [setTodos]);

  const deleteTodo = useCallback((todoToDeleteID: number) => {
    setTodos(currentTodos => currentTodos.filter(({ id }) => {
      return id !== todoToDeleteID;
    }));
  }, [setTodos]);

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

  const changeStatus = (newStatus: Status) => {
    setStatus(newStatus);
  };

  const todosValues = useMemo(() => ({
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
  }), [
    todos,
    filteredTodos,
    status,
    tempTodo,
    errorMessage,
    updatingTodosIds,
    addTodo,
    deleteTodo,
  ]);

  return (
    <TodoContext.Provider value={todosValues}>
      {children}
    </TodoContext.Provider>
  );
};
