import React, { useState } from 'react';

export const IsfinallyContext = React.createContext({
  isfinally: false as boolean,
  setIsfinally: (() => {}) as React.Dispatch<React.SetStateAction<boolean>>,
});
export const TempTodoContext = React.createContext({
  tempTodo: null as string | null,
  // eslint-disable-next-line max-len
  setTempTodo: (() => {}) as React.Dispatch<React.SetStateAction<string | null>>,
});
type Props = {
  children:React.ReactNode
};

export const TempTodoContextProvider : React.FC<Props> = ({ children }) => {
  const [isfinally, setIsfinally] = useState(false);
  const [tempTodo, setTempTodo] = useState<string | null>(null);

  return (
    <IsfinallyContext.Provider value={{ isfinally, setIsfinally }}>
      <TempTodoContext.Provider value={{ tempTodo, setTempTodo }}>
        {children}
      </TempTodoContext.Provider>
    </IsfinallyContext.Provider>
  );
};
