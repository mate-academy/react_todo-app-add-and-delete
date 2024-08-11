import { useContext } from 'react';
import { TodoContext } from '../../context/TodoContext';

export const useTodoContext = () => {
  const context = useContext(TodoContext);

  if (context === undefined) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }

  return context;
};
