import { useEffect } from 'react';

export const useClearErrorMessage = (
  errorMessage: string,
  setErrorMessage: (message: string) => void,
) => {
  useEffect(() => {
    let mistakeTimer: number | undefined;

    if (errorMessage) {
      mistakeTimer = window.setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    return () => {
      if (mistakeTimer !== undefined) {
        window.clearTimeout(mistakeTimer);
      }
    };
  }, [errorMessage, setErrorMessage]);
};
