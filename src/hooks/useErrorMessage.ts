import { useState, useEffect } from 'react';

export const useErrorMessage = () => {
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (errorMessage) {
      const timeoutId = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [errorMessage]);

  return { errorMessage, setErrorMessage };
};
