import { createContext, useState } from 'react';
import { TempTodo } from './types/TempTodo';
import { Todo } from './types/Todo';

export const TempTodoContext = createContext<TempTodo>({
  tempTodo: null,
  setTempTodo: () => { },
});

type Props = {
  children: React.ReactNode;
};

export const TempTodoProvider: React.FC<Props> = ({ children }) => {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  return (
    <TempTodoContext.Provider value={{ tempTodo, setTempTodo }}>
      {children}
    </TempTodoContext.Provider>
  );
};
