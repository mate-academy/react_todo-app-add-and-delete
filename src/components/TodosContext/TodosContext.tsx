import React, { useReducer, useState } from 'react';

import { Todo } from '../../types/Todo';
import { Action } from '../../types/Action';
import { Status } from '../../types/Status';

import { todosReducer } from '../../utils/todosReducer';

type Context = {
  todos: Todo[],
  dispatch: React.Dispatch<Action>,
  currentFilter: Status,
  setCurrentFilter: React.Dispatch<Status>,
  errorMessage: string,
  setErrorMessage: React.Dispatch<string>,
  tempTodo: Todo | null,
  setTempTodo: React.Dispatch<Todo | null>,
  clearAllIds: number[],
  setClearAllIds: React.Dispatch<number[]>,
};

const initialContext: Context = {
  todos: [],
  dispatch: () => {},
  currentFilter: Status.All,
  setCurrentFilter: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  clearAllIds: [],
  setClearAllIds: () => {},
};

export const TodosContext = React.createContext<Context>(initialContext);

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [todos, dispatch] = useReducer(todosReducer, []);
  const [currentFilter, setCurrentFilter] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [clearAllIds, setClearAllIds] = useState<number[]>([]);

  return (
    <TodosContext.Provider value={{
      todos,
      dispatch,
      currentFilter,
      setCurrentFilter,
      errorMessage,
      setErrorMessage,
      tempTodo,
      setTempTodo,
      clearAllIds,
      setClearAllIds,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};
