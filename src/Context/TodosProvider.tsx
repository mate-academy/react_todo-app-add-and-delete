import React, {
  createContext, useEffect, useReducer, useState,
} from 'react';

import { TodosListType, Todo } from '../types/todosTypes';
import { ApiErrorType } from '../types/apiErrorsType';
import { Actions } from '../types/actionTypes';
import { FiltersType } from '../types/filterTypes';

import { loadTodosAction } from './actions/actionCreators';

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
  tempTodo: Todo | null,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>
};

type ApiErrorContextType = {
  apiError: ApiErrorType,
  setApiError: React.Dispatch<React.SetStateAction<ApiErrorType>>
};

type FormFocusContextType = {
  isFocused: boolean,
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>
};

type Props = {
  children: React.ReactNode,
};

export const ApiErrorContext = createContext<ApiErrorContextType>({
  apiError: null,
  setApiError: () => { },
});

export const FormFocusContext = createContext<FormFocusContextType>({
  isFocused: true,
  setIsFocused: () => { },
});

export const TodosContext = createContext<TodosContextType>({
  todos: initialTodos,
  dispatch: () => null,
  filter: FiltersType.ALL,
  setFilter: () => { },
  tempTodo: null,
  setTempTodo: () => null,
});

// Component

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, dispatch] = useReducer(
    todosReducer,
    initialTodos,
  );
  const [apiError, setApiError] = useState<ApiErrorType>(null);
  const [filter, setFilter] = useState<FiltersType>(FiltersType.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isFocused, setIsFocused] = useState(true);

  const todosContextValue = {
    todos,
    dispatch,
    filter,
    setFilter,
    tempTodo,
    setTempTodo,
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => {
        const action = loadTodosAction(data);

        dispatch(action);
      })
      .catch(e => setApiError(e));
  }, []);

  return (
    <FormFocusContext.Provider value={{ isFocused, setIsFocused }}>
      <ApiErrorContext.Provider value={{ apiError, setApiError }}>
        <TodosContext.Provider value={todosContextValue}>
          {children}
        </TodosContext.Provider>
      </ApiErrorContext.Provider>
    </FormFocusContext.Provider>
  );
};
