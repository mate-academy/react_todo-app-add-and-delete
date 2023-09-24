import React, { useState } from 'react';
import { Todo } from '../types/Todo';

interface TodoContexValue {
  todos: Todo[];
  setTodos: (value: Todo[]) => void;
}

export const TodoContex = React.createContext<TodoContexValue>(
  {
    todos: [],
    setTodos: () => {},
  },
);

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  return (
    <TodoContex.Provider
      value={{
        todos,
        setTodos,
      }}
    >
      {children}
    </TodoContex.Provider>
  );
};
