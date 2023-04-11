import { TodoRich } from '../types/TodoRich';
import { TodoCompletionType } from '../types/TodoCompletionType';

export const filterTodos = (
  todos: TodoRich[],
  todoCompletionFilterOption: TodoCompletionType,
): TodoRich[] => (
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

export const getActiveTodosCount = (todos: TodoRich[]): number => (
  todos.filter(todo => todo.completed === false).length
);
