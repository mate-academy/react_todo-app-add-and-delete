import { useState, useCallback, useEffect } from 'react';

export function useErrorMessage() {
  const [error, setError] = useState('');

  const handleResetErrorMessage = useCallback(() => {
    setError('');
  }, []);

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      handleResetErrorMessage();
    }, 3000);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [error, handleResetErrorMessage]);

  return {
    error,
    setError,
    resetErrorMessage: handleResetErrorMessage,
  };
}
