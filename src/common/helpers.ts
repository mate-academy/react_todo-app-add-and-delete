import { Todo } from '../types/Todo';
import { TodoCompletionType } from '../types/TodoCompletionType';

export const filterTodos = (
  todos: Todo[],
  todoCompletionFilterOption: TodoCompletionType,
): Todo[] => (
  todos
    .filter(todo => {
      switch (todoCompletionFilterOption) {
        case TodoCompletionType.Completed:
          return todo.completed;
        case TodoCompletionType.Active:
          return !todo.completed;
        default:
          return true;
      }
    })
);

export const getActiveTodosCount = (todos: Todo[]): number => (
  todos.filter(todo => todo.completed === false).length
);
