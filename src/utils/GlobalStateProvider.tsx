import React, { useReducer } from 'react';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';

type Action =
  | { type: 'setTitle'; payload: string }
  | { type: 'setFilter'; payload: Filter }
  | { type: 'setTodos'; payload: Todo[] }
  | { type: 'setIsDisabled'; payload: boolean }
  | { type: 'setTempTodo'; payload: Todo | null }
  | { type: 'setDeletingList'; payload: number[] }
  | { type: 'setError'; payload: Errors };

interface State {
  title: string;
  filter: Filter;
  todos: Todo[];
  isDisabled: boolean;
  tempTodo: Todo | null;
  deletingList: number[];
  error: Errors;
}

const initialState: State = {
  title: '',
  filter: Filter.all,
  todos: [],
  isDisabled: false,
  tempTodo: null,
  deletingList: [],
  error: Errors.reset,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setTitle':
      return {
        ...state,
        title: action.payload,
      };
    case 'setFilter':
      return {
        ...state,
        filter: action.payload,
      };

    case 'setTodos':
      return {
        ...state,
        todos: action.payload,
      };

    case 'setIsDisabled':
      return {
        ...state,
        isDisabled: action.payload,
      };

    case 'setTempTodo':
      return {
        ...state,
        tempTodo: action.payload,
      };

    case 'setDeletingList':
      return {
        ...state,
        deletingList: action.payload,
      };

    case 'setError':
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
}

export const StateContext = React.createContext(initialState);
/* eslint-disable @typescript-eslint/no-unused-vars */
export const DispatchContext = React.createContext((action: Action) => {});

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};
