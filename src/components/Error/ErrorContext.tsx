import React, { useState } from 'react';
// import { User } from '../../types/User';

export const ErrorContext = React.createContext<any>(null);

type Props = {
  children: React.ReactNode;
};

export const ErrorProvider: React.FC<Props> = ({ children }) => {
  // const [user, setUser] = useState<User | null>(null);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');

  // if (!user) {
  //   return <AuthForm onLogin={setUser} />;
  // }

  return (
    <ErrorContext.Provider value={
      {
        isError, setIsError, errorText, setErrorText,
      }
    }
    >
      {children}
    </ErrorContext.Provider>
  );
};
