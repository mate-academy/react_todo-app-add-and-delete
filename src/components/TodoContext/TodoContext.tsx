import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type TC = {
  todos: Todo[];
  setTodos: (todos: Todo[] | ((prevState: Todo[]) => Todo[])) => void;
};

const DEFAULT_TODOSCONTEXT: TC = {
  todos: [],
  setTodos: () => {},
};

export const TodoContext = React.createContext(DEFAULT_TODOSCONTEXT);

type Props = {
  children: React.ReactNode;
};

export const TodoContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  return (
    <TodoContext.Provider value={{ todos, setTodos }}>
      {children}
    </TodoContext.Provider>
  );
};
