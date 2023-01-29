import { useState } from 'react';

type HookOutput = [
  string,
  (message: string) => void,
  () => void,
];

export const useError = (): HookOutput => {
  const [errorMessage, setErrorMessage] = useState('');

  const closeError = () => {
    setErrorMessage('');
  };

  const showError = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => closeError(), 3000);
  };

  return [errorMessage, showError, closeError];
};
