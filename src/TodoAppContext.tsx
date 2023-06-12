import React from 'react';
import { ContextType } from './types/ContextType';

export const TodoAppContext = React.createContext<ContextType>({
  todos: [],
  loading: false,
  loadingError: '',
  filterType: '',
  setFilterType: () => {},
  visibleTodos: [],
  activeTodos: [],
  complet: false,
  setComplet: () => {},
  addTodo: () => {},
  processings: [],
  clearTodos: () => {},
  removeTodo: () => {},
});
