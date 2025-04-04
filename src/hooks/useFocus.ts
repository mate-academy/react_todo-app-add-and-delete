import { useRef, useCallback } from 'react';

export const useFocus = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = useCallback(() => {
    if (!document.activeElement?.matches('.todoapp__new-todo')) {
      inputRef.current?.focus();
    }

    return inputRef.current;
  }, []);

  return {
    inputRef,
    focusInput,
  };
};
