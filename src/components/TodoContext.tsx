import React, { Dispatch, SetStateAction, useState } from 'react';
import { Todo } from '../types/Todo';

type PropsContext = [Todo[], Dispatch<SetStateAction<Todo[]>>];

export const TodoContext = React.createContext<PropsContext>([[], () => {}]);

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  return (
    <TodoContext.Provider value={[todos, setTodos]}>
      {children}
    </TodoContext.Provider>
  );
};
