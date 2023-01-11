import React, { useState } from 'react';

export const TodoContext = React.createContext<any>(null);

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState(todos);

  return (
    <TodoContext.Provider value={{
      todos, setTodos, visibleTodos, setVisibleTodos,
    }}
    >
      {children}
    </TodoContext.Provider>
  );
};
