import { useCallback, useEffect, useState } from 'react';

type ReturnError = {
  error: string;
  showError: (massage: string) => void;
  clearError: () => void;
};
export function useError(): ReturnError {
  const [error, setError] = useState('');

  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId = setTimeout(() => {
      setError('');
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [error]);

  const showError = useCallback((message: string) => {
    setError(message);
  }, []);

  function clearError() {
    setError('');
  }

  return { error, showError, clearError };
}
