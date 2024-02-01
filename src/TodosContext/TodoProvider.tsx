/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import TodoContext from '../types/TodosContext';
import { Todo } from '../types/Todo';

export const TodosContext = React.createContext<TodoContext>({
  deletingTodos: [],
  addTodoForDelete: (_todo: Todo) => {},
  removeTodoForDelete: (_todo: Todo) => {},
  resetDeletingTodos: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [deletingTodos, setDelitingTodos] = useState<Todo[]>([]);

  const addTodoForDelete = (todo: Todo):void => {
    setDelitingTodos(prev => ([...prev, todo]));
  };

  const removeTodoForDelete = (todo: Todo):void => {
    setDelitingTodos(prev => prev.filter(current => current.id !== todo.id));
  };

  const resetDeletingTodos = () => {
    setDelitingTodos([]);
  };

  return (
    <TodosContext.Provider value={{
      addTodoForDelete,
      resetDeletingTodos,
      deletingTodos,
      removeTodoForDelete,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};
