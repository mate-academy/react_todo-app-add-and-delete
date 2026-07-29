import { useEffect } from 'react';

export const useAutoDismissError = (
  errorMessage: string,
  onClear: () => void,
  delay = 3000,
) => {
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      onClear();
    }, delay);

    return () => clearTimeout(timerId);
  }, [errorMessage, onClear, delay]);
};
