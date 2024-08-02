import { useState, useEffect } from 'react';
import { ErrorType } from '../types/ErrorType';

export const useErrorState = () => {
  const [error, setError] = useState<ErrorType | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [error]);

  return { error, setError };
};
