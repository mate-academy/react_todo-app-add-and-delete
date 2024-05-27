import { Todo } from '../types/Todo';

export type TodoStatus = 'All' | 'Active' | 'Completed';

export const getFilteredTodos = (todos: Todo[], status: TodoStatus) => {
  let visibleTodos = [...todos];

  if (status !== 'All') {
    visibleTodos = visibleTodos.filter(todo => {
      return status === 'Active' ? !todo.completed : todo.completed;
    });
  }

  return visibleTodos;
};
