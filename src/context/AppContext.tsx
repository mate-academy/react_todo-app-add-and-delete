import {
  createContext, useContext,
} from 'react';
import { AppContextType, Filter } from '../types';

const AppContextDefault = {
  todos: [],
  setTodos: () => {},
  selectedFilter: 'All' as Filter,
  setSelectedFilter: () => {},
  showError: false,
  setShowError: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  visibleTodos: [],
  activeTodosNum: 0,
  completedTodosNum: 0,
  handleFilterChange: () => {},
  loadData: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  todosBeingoLoaded: [],
  setTodosBeingoLoaded: () => {},
};

export const AppContext = createContext<AppContextType>(AppContextDefault);

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }

  return context;
};
