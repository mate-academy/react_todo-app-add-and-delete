import React, { useReducer } from 'react';
import { stateReducer } from './reducers/stateReducer';
import { filters } from './lib/filters';
import { Action } from './types/Action';
import { State } from './types/State';

const defaultDispatch: React.Dispatch<Action> = () => {};

const initialState: State = {
  todos: [],
  tempTodo: null,
  inputValue: '',
  loadings: [],
  filter: filters[0],
  error: '',
};

export const DispatchContext = React.createContext(defaultDispatch);
export const StateContext = React.createContext(initialState);

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
