import { useState, useEffect, useCallback } from 'react';

export const useErrorMessage = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const handleRemoveError = useCallback(() => setErrorMessage(''), []);
  const handleSetError = useCallback(
    (errorText: string) => setErrorMessage(errorText),
    [],
  );

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(handleRemoveError, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorMessage, handleRemoveError]);

  return {
    errorMessage,
    handleRemoveError,
    handleSetError,
  };
};
