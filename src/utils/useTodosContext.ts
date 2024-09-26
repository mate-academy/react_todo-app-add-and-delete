import { useContext } from 'react';
import { TodosContext } from '../TodoContext';

export const useTodosContext = () => {
  const context = useContext(TodosContext);

  if (context === undefined) {
    throw new Error('Error');
  }

  return context;
};
