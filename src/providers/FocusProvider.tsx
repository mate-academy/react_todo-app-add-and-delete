import React, { useCallback, useMemo, useRef } from 'react';

type FocusContextType = {
  inputRef: React.RefObject<HTMLInputElement> | null;
  setFocus: () => void;
};

export const FocusContext = React.createContext<FocusContextType>({
  inputRef: null,
  setFocus: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const FocusProvider: React.FC<Props> = ({ children }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const setFocus = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const value = useMemo(
    () => ({
      inputRef,
      setFocus,
    }),
    [inputRef, setFocus],
  );

  return (
    <FocusContext.Provider value={value}>{children}</FocusContext.Provider>
  );
};
