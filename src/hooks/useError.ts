import { useCallback, useEffect, useState } from 'react';
import { Errors } from '../types/Error';

export function useError(): [Errors, (err: Errors) => void] {
  const [error, setError] = useState<Errors>(Errors.Default);
  const isError = !!error;

  const handleSetError = useCallback((err: Errors) => {
    setError(err);
  }, []);

  useEffect(() => {
    if (isError) {
      const timer = window.setTimeout(() => {
        setError(Errors.Default);
      }, 3000);

      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [isError]);

  return [error, handleSetError];
}
