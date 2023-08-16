/* eslint-disable no-console */
/* eslint-disable no-prototype-builtins */
import React, { createContext, useReducer } from 'react';

import {
  ErrorMessageActions,
  FiltertActions,
  TodoActions,
  UpdatedTodoIdActions,
  errorMessageReducer,
  filterReducer,
  todoReducer,
  updatedTodoIdReducer,
} from './reducer';
import { InitialStateType } from './types/InitialStateType';
import { Todo } from './types/Todo';

const initialTodos: Todo[] | [] = [];

const initialState: InitialStateType = {
  todos: initialTodos,
  itemsLeft() {
    if (this.todos.length) {
      return this.todos.filter(todo => todo.completed === false).length;
    }

    return 0;
  },
  filter: 'all',
  getVisibleTodos():Todo[] | [] {
    switch (this.filter) {
      case 'all':
        return [...this.todos];
      case 'completed':
        return this.todos.filter(todo => todo.completed === true);
      case 'active':
        return this.todos.filter(todo => todo.completed === false);
      default:
        return [...this.todos];
    }
  },
  updatedTodoIds: [],
  errorMessage: '',
};

const AppContext = createContext<{
  state: InitialStateType,
  dispatch: React.Dispatch<
  TodoActions
  | FiltertActions
  | UpdatedTodoIdActions
  | ErrorMessageActions
  >
}>({
  state: initialState,
  dispatch: () => null,
});

const mainReducer = (
  {
    todos,
    itemsLeft,
    filter,
    getVisibleTodos,
    updatedTodoIds,
    errorMessage,
  }: InitialStateType,
  action:
  TodoActions
  | FiltertActions
  | UpdatedTodoIdActions
  | ErrorMessageActions,
) => ({
  todos: todoReducer(todos, action as TodoActions),
  itemsLeft,
  getVisibleTodos,
  filter: filterReducer(filter, action as FiltertActions),
  updatedTodoIds: updatedTodoIdReducer(
    updatedTodoIds,
    action as UpdatedTodoIdActions,
  ),
  errorMessage: errorMessageReducer(
    errorMessage,
    action as ErrorMessageActions,
  ),
});

type Props = {
  children: React.ReactNode
};

const AppProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
