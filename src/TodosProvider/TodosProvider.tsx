import React, { useReducer } from 'react';

import { Props } from './types/Props';
import { TodosContext } from './TodosContext';
import { reducer } from './todosReducer';

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useReducer(reducer, []);

  return (
    <TodosContext.Provider value={{ todos, setTodos }}>
      {children}
    </TodosContext.Provider>
  );
};
