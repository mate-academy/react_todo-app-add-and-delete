import { createContext, useState } from 'react';

type SetInputRefContextType = React.Dispatch<React.SetStateAction<boolean>>;

export const InputRef = createContext<boolean>(false);
export const SetInputRef = createContext<SetInputRefContextType>(() => {});

type Props = {
  children: React.ReactNode;
};

export const InputRefContextProvider: React.FC<Props> = ({ children }) => {
  const [inputFocused, setInputFocused] = useState(false);

  return (
    <InputRef.Provider value={inputFocused}>
      <SetInputRef.Provider value={setInputFocused}>
        {children}
      </SetInputRef.Provider>
    </InputRef.Provider>
  );
};
