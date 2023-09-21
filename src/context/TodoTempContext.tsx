import {
  useState, createContext, useMemo,
} from 'react';
import { Todo } from '../types/Todo';

export const TodoTempContext = createContext<{
  todoTemp: Todo | null;
  setTodoTemp: React.Dispatch<React.SetStateAction<Todo | null>>;
}>({
  todoTemp: null,
  setTodoTemp: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodoTempProvider: React.FC<Props> = ({ children }) => {
  const [todoTemp, setTodoTemp] = useState<Todo | null>(null);

  const value = useMemo(() => ({
    todoTemp,
    setTodoTemp,
  }), [todoTemp]);

  return (
    <TodoTempContext.Provider value={value}>
      {children}
    </TodoTempContext.Provider>
  );
};
