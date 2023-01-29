import { useCallback, useState } from 'react';

type HookOutput = [
  string,
  (message: string) => void,
  () => void,
];

export const useError = (): HookOutput => {
  const [errorMessage, setErrorMessage] = useState('');

  const showError = useCallback((message: string) => {
    setErrorMessage(message);

    setTimeout(() => setErrorMessage(''), 3000);
  }, []);

  const hideError = useCallback(() => {
    setErrorMessage('');
  }, []);

  return [errorMessage, showError, hideError];
};
