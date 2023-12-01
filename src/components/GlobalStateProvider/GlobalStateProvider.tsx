import React, { useCallback, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../../types/TodoContext';

export const TodosContext = React.createContext<TodoContext>({
  todos: [],
  setTodos: () => { },
  errorMessage: '',
  setErrorMessage: () => { },
  status: Status.ALL,
  setStatus: () => { },
  tempTodo: null,
  setTempTodo: () => { },
  deletionId: null,
  setDeletionId: () => { },
  closeErrorMessage: () => { },
  inputRef: null,
  deleteTodosIds: [],
  setDeleteTodosIds: () => { },
});

type Props = {
  children: React.ReactNode,
};

export const GlobalStateProvier: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState<Status>(Status.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletionId, setDeletionId] = useState<number | null>(null);
  const [deleteTodosIds, setDeleteTodosIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const closeErrorMessage = useCallback(
    debounce(setErrorMessage, 3000),
    [],
  );

  const value: TodoContext = {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    status,
    setStatus,
    tempTodo,
    setTempTodo,
    deletionId,
    setDeletionId,
    closeErrorMessage,
    inputRef,
    deleteTodosIds,
    setDeleteTodosIds,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
