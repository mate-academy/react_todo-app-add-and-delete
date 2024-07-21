import { useContext, useCallback } from 'react';

import { DispatchContext } from '../store/TodoContext';
import { ActionType } from '../types/Actions';

export function useErrorMessage() {
  const dispatch = useContext(DispatchContext);

  return useCallback(
    (message: string) => {
      dispatch({ type: ActionType.SetErrorMessage, payload: message });

      const timeoutId = setTimeout(() => {
        dispatch({ type: ActionType.SetErrorMessage, payload: '' });
      }, 3000);

      return () => clearTimeout(timeoutId);
    },
    [dispatch],
  );
}
