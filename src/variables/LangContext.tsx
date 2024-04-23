import React from 'react';
import { Todo } from '../types/Todo';

interface TodoListContextType {
  updateTodo: (todo: Todo) => void;
  deleteTodo: (todoId: number) => void;
  loadingTodoIds: number[];
  tempTodo: Todo | null;
}

export const TodoListContext = React.createContext<TodoListContextType>({
  updateTodo: () => {},
  deleteTodo: () => {},
  loadingTodoIds: [],
  tempTodo: null,
});
