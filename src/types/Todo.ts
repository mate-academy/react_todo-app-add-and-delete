import { StatusFilter } from './statusFilter';

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export const getFilteredTodos = (
  todos: Todo[],
  { status }: { status: StatusFilter },
) => {
  let filteredTodos = [...todos];

  // !switch case
  if (status !== StatusFilter.All) {
    filteredTodos = filteredTodos.filter(todo => {
      if (status === StatusFilter.Completed) {
        return todo.completed;
      }

      return !todo.completed;
    });
  }

  return filteredTodos;
};
