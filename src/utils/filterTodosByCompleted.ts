import { Todo } from '../types/Todo';
import { TodoCompletedCategory } from '../types/TodoCompletedCategory';

export function filterTodosByComplated(
  todos: Todo[],
  query: TodoCompletedCategory,
): Todo[] {
  switch (query) {
    case TodoCompletedCategory.active:
      return todos.filter(todo => !todo.completed);
    case TodoCompletedCategory.completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}
