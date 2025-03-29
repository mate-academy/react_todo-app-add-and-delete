import { useState, useRef } from 'react';
import { ErrorType } from '../types/Error';

export const useErrorHandler = () => {
  const [error, setError] = useState<ErrorType | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleError = (
    error_type: ErrorType | null,
    timeout: number = 3000,
  ) => {
    setError(error_type);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (error_type !== null) {
      timerRef.current = setTimeout(() => {
        setError(null);
      }, timeout);
    }
  };

  return {
    error,
    handleError,
  };
};
