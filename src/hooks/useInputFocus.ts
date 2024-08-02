import { useEffect, useRef, useState } from 'react';

export const useInputFocus = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focusInput, setFocusInput] = useState<boolean>(false);

  useEffect(() => {
    if (focusInput) {
      inputRef.current?.focus();
      setFocusInput(false);
    }
  }, [focusInput]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const triggerFocus = () => setFocusInput(true);

  return { inputRef, triggerFocus };
};
