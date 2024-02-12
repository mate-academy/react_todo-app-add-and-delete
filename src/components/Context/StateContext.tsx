import React, { useEffect, useReducer } from 'react';

import { getTodos } from '../../api/todos';
import { Filter } from '../../types/Filter';
import { Notification } from '../../types/Notification';
import { State } from '../../types/State';
import { USER_ID } from '../../utils/constants';
import { Action, reducer } from './reducer';

const initialState: State = {
  todos: [],
  tempTodo: null,
  filterType: Filter.ALL,
  notification: null,
  coveredTodoIds: [0],
};

export const StateContext = React.createContext(initialState);
export const DispatchContext = React
  .createContext<React.Dispatch<Action>>(() => { });

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({
      type: 'showNotification',
      notification: null,
    });

    getTodos(USER_ID)
      .then(todosFromServer => dispatch({
        type: 'getTodos',
        todos: todosFromServer,
      }))
      .catch(() => dispatch({
        type: 'showNotification',
        notification: Notification.LOAD_TODOS,
      }));
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
