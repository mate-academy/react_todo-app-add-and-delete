import { createContext, useState } from 'react';
import { Todo } from '../types';

type SetTodosContextType = React.Dispatch<React.SetStateAction<Todo[]>>;

export const TodosContext = createContext<Todo[]>([]);
export const SetTodosContext = createContext<SetTodosContextType>(() => []);

type Props = {
  children: React.ReactNode;
};

export const TodosContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  return (
    <TodosContext.Provider value={todos}>
      <SetTodosContext.Provider value={setTodos}>
        {children}
      </SetTodosContext.Provider>
    </TodosContext.Provider>
  );
};
