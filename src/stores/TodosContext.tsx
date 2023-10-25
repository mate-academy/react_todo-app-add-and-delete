import React, { useState, useEffect } from 'react';
import { ErrorMessages } from '../types/ErrorMessages';
import { FilterParams } from '../types/FilterParams';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

type SetTodos = (prev: Todo[]) => Todo[];
type SetIds = (prev: number[]) => number[];

interface State {
  USER_ID: number;
  todos: Todo[];
  filterBy: FilterParams;
  errorText: ErrorMessages;
  hasErrors: boolean;
  waitForResponse: boolean;
  todoIdToUpdate: number;
  idsToDelete: number[];
  setTodos: (v: SetTodos) => void;
  setFilterBy: (v: FilterParams) => void;
  setErrorText: (v: ErrorMessages) => void;
  setHasErrors: (v: boolean) => void;
  setWaitForResponse: (v: boolean) => void;
  setTodoIdToUpdate: (v: number) => void;
  setIdsToDelete: (v: SetIds) => void;
}

const initialState: State = {
  USER_ID: 0,
  todos: [],
  filterBy: FilterParams.All,
  errorText: ErrorMessages.None,
  hasErrors: false,
  waitForResponse: false,
  todoIdToUpdate: 0,
  idsToDelete: [],
  setTodos: () => {},
  setFilterBy: () => {},
  setErrorText: () => {},
  setHasErrors: () => {},
  setWaitForResponse: () => {},
  setTodoIdToUpdate: () => {},
  setIdsToDelete: () => {},
};

export const TodosContext = React.createContext<State>(initialState);

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const USER_ID = 11712;
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterParams>(FilterParams.All);
  const [errorText, setErrorText] = useState<ErrorMessages>(ErrorMessages.None);
  const [hasErrors, setHasErrors] = useState(false);
  const [waitForResponse, setWaitForResponse] = useState(false);
  const [todoIdToUpdate, setTodoIdToUpdate] = useState(0);
  const [idsToDelete, setIdsToDelete] = useState<number[]>([]);

  useEffect(() => {
    client
      .get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then((todosFromServer) => setTodos(todosFromServer))
      .catch(() => {
        setHasErrors(true);
        setErrorText(ErrorMessages.Loading);
      });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setHasErrors(false);
    }, 3000);
  }, [hasErrors]);

  const state: State = {
    USER_ID,
    todos,
    filterBy,
    errorText,
    hasErrors,
    waitForResponse,
    todoIdToUpdate,
    idsToDelete,
    setTodos,
    setFilterBy,
    setErrorText,
    setHasErrors,
    setWaitForResponse,
    setTodoIdToUpdate,
    setIdsToDelete,
  };

  return (
    <TodosContext.Provider value={state}>{children}</TodosContext.Provider>
  );
};
