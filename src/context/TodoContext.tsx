import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import { Error } from '../types/ErrorMessage';
import { getTodos } from '../api/todos';
import { wait } from '../utils/fetchClient';
import { getFilteredTodos } from '../utils/getFilteredTodos';
import { USER_ID } from '../types/userId';

type ContextProps = {
  todos: Todo[];
  filteredTodos: Todo[];
  filter: Status;
  tempTodo: Todo | null;
  errorMessage: Error | null;
  updatingIds: number[];
  addTodo: (newTodo: Todo) => void;
  deleteTodo: (todoID: number) => void;
  handleSetTempTodo: (newTodo: Todo | null) => void;
  handleSetErrorMessage: (newError: Error) => void;
  handleSetUpdatingIds: (id: number | null) => void;
  filterChange: (newStatus: Status) => void;
};

export const TodoContext = React.createContext<ContextProps>({
  todos: [],
  filteredTodos: [],
  filter: Status.all,
  tempTodo: null,
  errorMessage: Error.none,
  updatingIds: [],
  addTodo: () => {},
  deleteTodo: () => {},
  handleSetTempTodo: () => {},
  handleSetErrorMessage: () => {},
  handleSetUpdatingIds: () => {},
  filterChange: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Error | null>(null);
  const [filter, setFilter] = useState(Status.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Error.todosLoading);

        return wait(3000).then(() => setErrorMessage(null));
      });
  }, []);

  useEffect(() => {
    wait(3000).then(() => setErrorMessage(Error.none));
  }, [errorMessage]);

  const filteredTodos = getFilteredTodos(todos, filter);

  const addTodo = useCallback(
    (newTodo: Todo) => {
      setTodos(currentTodos => [...currentTodos, newTodo]);
    },
    [setTodos],
  );

  const deleteTodo = useCallback(
    (todoId: number) => {
      setTodos(currentTodos =>
        currentTodos.filter(todo => {
          return todo.id !== todoId;
        }),
      );
    },
    [setTodos],
  );

  const handleSetTempTodo = (newTodo: Todo | null) => {
    setTempTodo(newTodo);
  };

  const handleSetErrorMessage = (newError: Error) => {
    setErrorMessage(newError);
  };

  const handleSetUpdatingIds = (id: number | null) => {
    if (id) {
      setUpdatingIds(currentIds => [...currentIds, id]);
    } else {
      setUpdatingIds([]);
    }
  };

  const filterChange = (newFilter: Status) => {
    setFilter(newFilter);
  };

  const todosValue = useMemo(
    () => ({
      todos,
      filteredTodos,
      filter,
      tempTodo,
      errorMessage,
      updatingIds,
      addTodo,
      deleteTodo,
      handleSetErrorMessage,
      handleSetTempTodo,
      handleSetUpdatingIds,
      filterChange,
    }),
    [
      todos,
      filteredTodos,
      filter,
      tempTodo,
      errorMessage,
      updatingIds,
      addTodo,
      deleteTodo,
    ],
  );

  return (
    <TodoContext.Provider value={todosValue}>{children}</TodoContext.Provider>
  );
};
