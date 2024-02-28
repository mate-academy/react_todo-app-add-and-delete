import React, { ReactNode, useMemo, useState } from 'react';
import { Todo } from '../../types/Todo';

interface TodosContextType {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
}

type ProviderProps = {
  children: ReactNode;
};

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  setTodos: () => {},
});

export const TodosProvider: React.FC<ProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const context = useMemo(
    () => ({
      todos,
      setTodos,
    }),
    [todos, setTodos],
  );

  return (
    <TodosContext.Provider value={context}> {children} </TodosContext.Provider>
  );
};
