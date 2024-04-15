import React, { useMemo, useState } from 'react';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
};

type TodosContextType = {
  todos: Todo[];
  setTodos: (v: Todo[]) => void;
};

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  setTodos: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  function useLocalStorage<T>(key: string, startValue: T): [T, (v: T) => void] {
    const [value, setValue] = useState(() => {
      const data = localStorage.getItem(key);

      if (data === null) {
        return startValue;
      }

      try {
        return JSON.parse(data);
      } catch {
        return startValue;
      }
    });

    const save = (newValue: T) => {
      localStorage.setItem(key, JSON.stringify(newValue));
      setValue(newValue);
    };

    return [value, save];
  }

  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);

  const value = useMemo(
    () => ({
      todos,
      setTodos,
    }),
    [todos, setTodos],
  );

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
