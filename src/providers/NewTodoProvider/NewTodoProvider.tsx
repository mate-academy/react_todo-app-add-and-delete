import {
  createContext,
} from 'react';
import { useNewTodo } from '../../CustomHooks/useNewTodo';

type NewTodoContextType = ReturnType<typeof useNewTodo>;

export const NewTodoContext
= createContext<NewTodoContextType | undefined>(undefined);

type NewTodoProviderProps = {
  children: React.ReactNode
};
export const NewTodoProvider = ({ children }: NewTodoProviderProps) => {
  const { ...args } = useNewTodo();

  return (
    <NewTodoContext.Provider value={{ ...args }}>
      {children}
    </NewTodoContext.Provider>
  );
};
