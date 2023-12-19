import { createContext, useContext } from 'react';

export const AuthContext = createContext<number | null>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};
