import { useState, useRef } from 'react';

export type ErrorState = {
  isError: boolean;
  errorMessage: string;
};

export const useError = () => {
  const [error, setError] = useState<ErrorState>({
    isError: false,
    errorMessage: '',
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showError = (message: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setError({
      isError: true,
      errorMessage: message,
    });

    timeoutRef.current = setTimeout(() => {
      setError({ isError: false, errorMessage: '' });
      timeoutRef.current = null;
    }, 3000);
  };

  const closeError = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setError({ isError: false, errorMessage: '' });
  };

  return {
    error,
    showError,
    closeError,
  };
};
