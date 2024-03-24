import React, { createContext, useReducer } from 'react';
import { ClientTodo } from '../../types';
import { Action } from './types';
import { todosContextReducer } from './todosContextReducer';

export const TodosContext = createContext<ClientTodo[]>([]);
export const TodosDispatchContext = createContext<React.Dispatch<Action>>(
  () => {},
);

type Props = {
  children: React.ReactNode;
};

export const TodosProvaider: React.FC<Props> = ({ children }) => {
  const [todos, dispatch] = useReducer(todosContextReducer, []);

  return (
    <TodosContext.Provider value={todos}>
      <TodosDispatchContext.Provider value={dispatch}>
        {children}
      </TodosDispatchContext.Provider>
    </TodosContext.Provider>
  );
};
