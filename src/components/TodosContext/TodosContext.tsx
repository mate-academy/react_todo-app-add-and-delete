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
};

const initialContext: Context = {
  todos: [],
  dispatch: () => {},
  currentFilter: Status.All,
  setCurrentFilter: () => {},
};

export const TodosContext = React.createContext<Context>(initialContext);

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [todos, dispatch] = useReducer(todosReducer, []);
  const [currentFilter, setCurrentFilter] = useState(Status.All);

  return (
    <TodosContext.Provider value={{
      todos,
      dispatch,
      currentFilter,
      setCurrentFilter,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};
