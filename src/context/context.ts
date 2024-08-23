import { createContext, Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';

interface ContextProps {
  todoLoadingStates: { [key: number]: boolean };
  setTodoLoading: (id: number, status: boolean) => void;
  setErrorMessage: (message: string) => void;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  handleDelete: (id: number) => void;
}

export const TodoContext = createContext<ContextProps | undefined>(undefined);

export const { Provider } = TodoContext;
