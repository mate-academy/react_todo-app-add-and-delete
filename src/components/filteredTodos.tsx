import { useMemo } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  filter: 'all' | 'active' | 'completed';
  todos: Todo[];
};

export const useFilteredTodos = ({ todos, filter }: Props) => {
  return useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);
};
