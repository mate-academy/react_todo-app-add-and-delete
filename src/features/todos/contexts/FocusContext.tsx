import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
} from 'react';

type FocusContextType = {
  setFocusRef: (ref: React.RefObject<HTMLInputElement>) => void;
  focusInput: () => void;
};

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export const FocusProvider = ({ children }: { children: ReactNode }) => {
  const inputRef = useRef<React.RefObject<HTMLInputElement> | null>(null);

  const setFocusRef = useCallback((ref: React.RefObject<HTMLInputElement>) => {
    inputRef.current = ref;
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.current?.focus();
  }, []);

  return (
    <FocusContext.Provider value={{ setFocusRef, focusInput }}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocus = () => {
  const ctx = useContext(FocusContext);

  if (!ctx) {
    throw new Error('useFocus must be used within a FocusProvider');
  }

  return ctx;
};
