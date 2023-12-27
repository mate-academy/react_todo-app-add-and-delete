import { useEffect, useReducer } from 'react';
import {
  initialState,
  reducer,
  DispatchContext,
  StateContext,
} from '../../libs/state';
import { getTodos } from '../../api/todos';
import { USER_ID } from '../../libs/constants';
import { Actions, ErrorMessages } from '../../libs/enums';

type Props = {
  children: React.ReactNode;
};

export const StateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getTodos(USER_ID)
      .then((response) => (
        dispatch({ type: Actions.load, payload: { todos: response } })
      ))
      .catch(() => (
        dispatch({
          type: Actions.setErrorMessage,
          payload: { errorMessage: ErrorMessages.FailedToLoad },
        })
      ));
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
