import { createContext } from 'react';
import { Todo } from '../types/Todo';

export const TodoContext = createContext<{
  setTodos:(todos: Todo[]) => void;
  isLoading: boolean;
  setError: (error: string | null) => void;
  isDeleting: boolean;
  setIsDeleting: (isDeleting: boolean) => void;
}>({
      setTodos: () => {},
      isLoading: true,
      setError: () => {},
      isDeleting: false,
      setIsDeleting: () => {},
    });
