import { createContext, useContext } from 'react';
import { Filters } from '../../App';

interface ContextType {
  filter: Filters;
  changeFilter: (name: Filters) => void;
}

export const Context = createContext<ContextType | undefined>(undefined);

export const useFilterContext = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('undefined Context');
  }

  return context;
};
