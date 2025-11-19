import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';

export function getFilteredTodos(
  todos: Todo[],
  { status }: { status: TodoStatus },
) {
  if (status === 'All') {
    return todos;
  }

  return todos.filter(todo => {
    switch (status) {
      case 'Active':
        return !todo.completed;

      case 'Completed':
        return todo.completed;
    }
  });
}
