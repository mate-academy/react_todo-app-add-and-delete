import { useCallback, useEffect, useState } from 'react';
import { Errors } from '../types/Error';

export function useError(): [Errors | null, (err: Errors | null) => void] {
  const [error, setError] = useState<Errors | null>(null);
  const isError = !!error;

  const handleSetError = useCallback((err: Errors | null) => {
    setError(err);
  }, []);

  useEffect(() => {
    if (isError) {
      const timer = window.setTimeout(() => {
        setError(null);
      }, 3000);

      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [isError]);

  return [error, handleSetError];
}
