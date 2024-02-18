import React, { createContext, useEffect, useReducer } from 'react';
import { Action } from './Action';
import { ActionTypes } from './ActionTypes';
import { ErrorTypes } from '../types/ErrorTypes';
import { getTodos } from '../api/todos';
import { USER_ID } from '../utils/constants';
import { Todo } from '../types/Todo';

type State = {
  todos: Todo[];
  error: ErrorTypes | null;
};

const initialContext: State = {
  todos: [],
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.LoadTodos: {
      return {
        ...state,
        ...action.payload,
      };
    }

    case ActionTypes.CloseError: {
      return {
        ...state,
        error: null,
      };
    }

    default:
      return state;
  }
}

export const StateContext = createContext(initialContext);

type Dispatch = (action: Action) => void;

export const DispatchContext = createContext<Dispatch>(() => {});

type Provider = {
  children: React.ReactNode;
};

export const StateProvider: React.FC<Provider> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialContext);

  useEffect(() => {
    getTodos(USER_ID)
      .then(todos => {
        dispatch({
          type: ActionTypes.LoadTodos,
          payload: { todos },
        });
      })
      .catch(() => {
        dispatch({
          type: ActionTypes.LoadTodos,
          payload: {
            error: ErrorTypes.UnableToLoadTodos,
          },
        });
      });
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};
