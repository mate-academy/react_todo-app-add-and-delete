import { useCallback, useEffect, useState } from 'react';

export function useErrorMessage() {
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleResetErrorMessage = useCallback(() => {
    setErrorMessage('');
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleResetErrorMessage();
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [errorMessage, handleResetErrorMessage]);

  return {
    errorMessage,
    setErrorMessage,
    resetErrorMessage: handleResetErrorMessage,
  };
}
