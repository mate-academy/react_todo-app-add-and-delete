import React, {
  createContext, useEffect, useReducer, useState,
} from 'react';

import { TodosListType } from '../types/todosTypes';
import { ApiErrorType } from '../types/apiErrorsType';
import { Actions } from '../types/actionTypes';
import { FiltersType } from '../types/filterTypes';

import { loadTodosAction } from './actions';

import { initialTodos } from './InitialTodos';
import { todosReducer } from './TodosReducer';

import { getTodos } from '../api/todos';
import USER_ID from '../helpers/USER_ID';

// create Context and types

type TodosContextType = {
  todos: TodosListType,
  dispatch: React.Dispatch<Actions>,
  filter: FiltersType,
  setFilter: React.Dispatch<React.SetStateAction<FiltersType>>
};

type ApiErrorContextType = {
  apiError: ApiErrorType,
  setApiError: React.Dispatch<React.SetStateAction<ApiErrorType>>
};

type Props = {
  children: React.ReactNode,
};

export const ApiErrorContext = createContext<ApiErrorContextType>({
  apiError: null,
  setApiError: () => {},
});

export const TodosContext = createContext<TodosContextType>({
  todos: initialTodos,
  dispatch: () => null,
  filter: FiltersType.ALL,
  setFilter: () => {},
});

// Component

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, dispatch] = useReducer(
    todosReducer,
    initialTodos,
  );
  const [apiError, setApiError] = useState<ApiErrorType>(null);
  const [filter, setFilter] = useState<FiltersType>(FiltersType.ALL);

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => {
        const action = loadTodosAction(data);

        dispatch(action);
      })
      .catch(e => setApiError(e));
  }, []);

  return (
    <ApiErrorContext.Provider value={{ apiError, setApiError }}>
      <TodosContext.Provider
        value={{
          todos, dispatch, filter, setFilter,
        }}
      >
        {children}
      </TodosContext.Provider>
    </ApiErrorContext.Provider>
  );
};
