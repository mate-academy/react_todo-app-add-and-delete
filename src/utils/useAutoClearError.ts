import React, { useEffect, useCallback } from 'react';

import { TodoErrors } from '../types/TodoErrors';
import { Action } from '../components/TodoContext';

export const useAutoClearError = (
  dispatch: React.Dispatch<Action>,
  error: TodoErrors | null,
) => {
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', error: null });
  }, [dispatch]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (error) {
      timer = setTimeout(clearError, 3000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [clearError, error]);
};
