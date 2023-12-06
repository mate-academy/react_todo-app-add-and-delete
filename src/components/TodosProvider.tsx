import React, { useEffect, useReducer } from 'react';
import { getTodos } from '../api/todos';
import { initialState } from '../constants/initialState';
import { Action } from '../types/Action';
import { reduser } from '../utils/reduser';
import { ErrorMessage } from '../types/ErrorMessage';
import { USER_ID } from '../constants/userId';

export const StateContext = React.createContext(initialState);
export const DispatchContext
  = React.createContext<(action: Action) => void>(() => {});

type Props = {
  children: React.ReactNode
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reduser, initialState);

  useEffect(() => {
    dispatch(
      { type: 'error', payload: ErrorMessage.None },
    );

    (async () => {
      try {
        const todosFromServer = await getTodos(USER_ID);

        dispatch({ type: 'loadingTodos', payload: todosFromServer });
      } catch (error) {
        dispatch({ type: 'error', payload: ErrorMessage.Loading });
      }
    })();
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
