import { StatusFilter, Todo } from '../../types/Todo';

export const filterTodos = (
  todos: Todo[] | null,
  filter: StatusFilter,
): Todo[] => {
  if (!todos) {
    return [];
  }

  if (filter === StatusFilter.All) {
    return todos;
  }

  return todos.filter((todo) => {
    return (filter === StatusFilter.Active ? !todo.completed : todo.completed);
  });
};
