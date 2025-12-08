import { createContext } from 'react';

type TodoContextType = {
  onDeleteTodo: (id: number) => Promise<void>;
  onCompleteTodo: (id: number) => Promise<void>;
};

export const TodoContext = createContext<TodoContextType>({
  onDeleteTodo: async () => {},
  onCompleteTodo: async () => {},
});
