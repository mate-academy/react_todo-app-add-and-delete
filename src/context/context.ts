import { createContext } from 'react';

interface ContextProps {
  onSelectInputChange: (id: number, completed: boolean) => void;
  todoLoadingStates: { [key: number]: boolean };
  deleteTodoInTodoList: (id: number) => void;
}

export const TodoContext = createContext<ContextProps | undefined>(undefined);

export const { Provider } = TodoContext;
