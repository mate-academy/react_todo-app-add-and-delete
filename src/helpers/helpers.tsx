import { Filters } from '../components/Footer/Footer';
import { Todo } from '../types/Todo';

export const filteredTodos = (
  todos: Todo[],
  filter: Filters,
) => {
  if (filter === Filters.ALL) {
    return todos;
  }

  return todos.filter((todo) => (filter === Filters.COMPLETED
    ? todo.completed
    : !todo.completed
  ));
};

export const getCompletedTodoIds = (todos: Todo[]) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const completedTodoIds = completedTodos.map(todo => todo.id);

  return completedTodoIds;
};
