import { createContext, useContext } from 'react';
import { useTodos } from '../../CustomHooks/useTodos';
import { TodosContextType, TodosProviderProps } from './types';

export const TodosContext
= createContext<TodosContextType | undefined>(undefined);

export const TodosProvider = ({ children, userId }: TodosProviderProps) => {
  const { ...args } = useTodos(userId);

  return (
    <TodosContext.Provider value={{ ...args, userId }}>
      {children}
    </TodosContext.Provider>
  );
};

export const useTodosContext = () => {
  const contextValues = useContext(TodosContext);

  if (!contextValues) {
    throw new Error('TodosContext must be in TodosProvider');
  }

  return contextValues;
};
