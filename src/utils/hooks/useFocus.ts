import { useRef, useEffect } from 'react';
import { useTodoContext } from './useTodoContext';

export const useFocus = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { lockedFocus } = useTodoContext();

  useEffect(() => {
    if (lockedFocus) {
      inputRef.current?.focus();
    }
  }, [lockedFocus]);

  return { inputRef };
};
