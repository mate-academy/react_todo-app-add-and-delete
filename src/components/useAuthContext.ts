import { useContext } from 'react';
import { AuthContext } from '../hooks/AuthContext';

export const useAuthContext = () => {
  return useContext(AuthContext);
};
