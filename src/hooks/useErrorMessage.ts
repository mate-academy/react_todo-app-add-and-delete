import { useCallback, useEffect, useState } from 'react';

export function useErrorMessage() {
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetErrorMessage = useCallback(() => {
    setErrorMessage('');
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleResetErrorMessage();
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errorMessage, handleResetErrorMessage]);

  return {
    errorMessage,
    resetErrorMessage: handleResetErrorMessage,
    setErrorMessage,
  };
}
