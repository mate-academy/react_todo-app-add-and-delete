import { useState } from 'react';

interface UseError {
  errorMessage: string;
  setErrorMessage: (message: string) => void;
}

const useError = (): UseError => {
  const [errorMessage, setErrorMessageUse] = useState<string>('');

  const setErrorMessage = (message: string) => {
    setErrorMessageUse(message);

    setTimeout(() => {
      setErrorMessageUse('');
    }, 3000);
  };

  return { errorMessage, setErrorMessage }; // Повертайте setError
};

export default useError;
