import { RefObject } from 'react';

export const focusInput = (inputRef: RefObject<{ focus: () => void }>) => {
  const timeout = setTimeout(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, 0);

  return () => clearTimeout(timeout);
};
