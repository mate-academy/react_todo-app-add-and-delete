import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';

export const selectTodos = (state:RootState) => state.todos.todos;
export const selectFilter = (state:RootState) => state.todos.filter;
export const selectError = (state:RootState) => state.todos.error;
export const selectLoadingTodosIds = (state:RootState) => (
  state.todos.loadingTodosIds
);

export const selectFilteredTodos = createSelector(
  [
    selectTodos,
    selectFilter,
  ],
  (todos, filter) => {
    return filter !== 'all'
      ? todos?.filter(todo => {
        return filter === 'completed' ? todo.completed : !todo.completed;
      })
      : todos;
  },
);

export const selectCompletedTodosIds = createSelector(
  [
    selectTodos,
  ],
  (todos) => todos?.filter(todo => todo.completed).map((todo) => todo.id) || [],
);

export const selectActiveTodosIds = createSelector(
  [
    selectTodos,
  ],
  (todos) => todos?.filter(todo => !todo.completed)
    .map((todo) => todo.id) || [],
);
