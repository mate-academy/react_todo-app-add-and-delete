import { createContext, useRef } from 'react';

export const InputFieldRefContext =
  createContext<React.RefObject<HTMLInputElement> | null>(null);

type Props = {
  children: React.ReactNode;
};

export const InputFieldRefContextProvider: React.FC<Props> = ({ children }) => {
  const inputFieldRef = useRef(null);

  return (
    <InputFieldRefContext.Provider value={inputFieldRef}>
      {children}
    </InputFieldRefContext.Provider>
  );
};
