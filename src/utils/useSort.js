import { useMemo } from 'react';
import { Sort } from '../types/Sort';

export const useSort = (todos, sort) => {
  const modifiedTodos = useMemo(() => {
    return (todos
      .filter(todo => {
        switch (sort) {
          case Sort.active:
            return !todo.completed;
          case Sort.completed:
            return todo.completed;
          case Sort.all:
          default:
            return todo;
        }
      })
    );
  }, [todos, sort]);

  return modifiedTodos;
};
