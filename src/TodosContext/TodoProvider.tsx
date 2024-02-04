/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import TodoContext from '../types/TodosContext';
import { Todo } from '../types/Todo';

export const TodosContext = React.createContext<TodoContext>({
  upatingTodos: [],
  addTodoForUpdate: (_todo: Todo) => {},
  removeTodoForUpdate: (_todo: Todo) => {},
  resetDeletingTodos: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [upatingTodos, setUpdatingTodos] = useState<Todo[]>([]);

  const addTodoForUpdate = (todo: Todo):void => {
    setUpdatingTodos(prev => ([...prev, todo]));
  };

  const removeTodoForUpdate = (todo: Todo):void => {
    setUpdatingTodos(prev => prev.filter(current => current.id !== todo.id));
  };

  const resetDeletingTodos = () => {
    setUpdatingTodos([]);
  };

  return (
    <TodosContext.Provider value={{
      addTodoForUpdate,
      resetDeletingTodos,
      upatingTodos,
      removeTodoForUpdate,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};
