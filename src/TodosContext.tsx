/* eslint-disable max-len */
import React, { useReducer, useState } from 'react';
import { initialValue, ActionState } from './helpers/helpers';
import { reducer } from './helpers/reducer';
import { Todo } from './types/Todo';

export const TodosContext = React.createContext(initialValue);

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, dispatch] = useReducer(reducer, []);

  const [filterTodos, setFilterTodos] = useState(ActionState.ALL);
  const [errorMessage, setErrorMessage] = useState('');

  const visibleTodos = todos.filter((todo: Todo) => {
    switch (filterTodos) {
      case ActionState.ACTIVE:
        return !todo.completed;
      case ActionState.COMPLETED:
        return todo.completed;
      default: return true;
    }
  });

  return (
    <TodosContext.Provider
      value={{
        todos,
        dispatch,
        filterTodos,
        setFilterTodos,
        visibleTodos,
        errorMessage,
        setErrorMessage,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
