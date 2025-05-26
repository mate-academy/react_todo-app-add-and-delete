import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filter: string): Todo[] => {
  return todos.filter((todo: Todo) => {
    return (
      filter === 'all' ||
      (filter === 'completed' && todo.completed) ||
      (filter === 'active' && !todo.completed)
    );
  });
};
