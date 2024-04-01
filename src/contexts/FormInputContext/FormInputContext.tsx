import React, { createContext, useCallback, useRef } from 'react';
import { FormInputContextValue } from './types';

const initialState: FormInputContextValue = {
  ref: {
    current: null,
  },
  focus() {},
  setDisabled() {},
};

export const FormInputContext =
  createContext<FormInputContextValue>(initialState);

type Props = {
  children: React.ReactNode;
};

export const FormInputProvider: React.FC<Props> = ({ children }) => {
  const ref = useRef<HTMLInputElement>(null);

  const setDisabled = useCallback((newValue: boolean) => {
    if (ref.current) {
      ref.current.disabled = newValue;
    }
  }, []);

  const focus = useCallback(() => {
    ref.current?.focus();
  }, []);

  return (
    <FormInputContext.Provider value={{ ref, setDisabled, focus }}>
      {children}
    </FormInputContext.Provider>
  );
};
