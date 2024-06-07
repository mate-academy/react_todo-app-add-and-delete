import * as React from 'react';

import { Filters } from '../types/Filters';
import { TodoListContextType } from '../types/TodoListContextType';

export const TodoListContext = React.createContext<TodoListContextType>({
  todos: [],
  errorMessage: null,
  tempTodo: null,
  currentFilter: Filters.All,
  setCurrentFilter: () => {},
  addTodo: () => {},
  deleteTodo: () => {},
  clearErrorMessage: () => {},
  clearCompletedTodo: () => {},
});
