import { useContext, useCallback } from 'react';

import { DispatchContext } from '../store/TodoContext';
import { setErrorMessageAction } from './todoActions';

export function useErrorMessage() {
  const dispatch = useContext(DispatchContext);

  return useCallback(
    (message: string) => {
      dispatch(setErrorMessageAction(message));

      const timeoutId = setTimeout(() => {
        dispatch(setErrorMessageAction(''));
      }, 3000);

      return () => clearTimeout(timeoutId);
    },
    [dispatch],
  );
}
