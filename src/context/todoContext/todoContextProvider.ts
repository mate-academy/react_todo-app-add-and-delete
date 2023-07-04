import { FC, ReactNode, memo, useMemo, useState } from "react";
import { TodoContext, TodoContextProps } from "./todoContext";

interface Props {
  children: ReactNode,
}

export const TodoContextProvider: FC<Props> = memo(({ children }) => {
  const [todos, setTodos] = useState([]);

  const addTodo = () => {

  }

const value: TodoContextProps = useMemo(() => ({
    todos,
    addTodo,
  }), [addTodo, todos,]);
  TodoContext.Provider

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
});

