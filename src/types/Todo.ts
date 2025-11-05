import { TodoStatusFilter } from '../components/TodoStatusFilter';

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export const getFilteredTodos = (
  todos: Todo[],
  { status }: { status: TodoStatusFilter },
) => {
  let filteredTodos = [...todos];

  if (status !== TodoStatusFilter.All) {
    filteredTodos = filteredTodos.filter(todo => {
      switch (status) {
        case TodoStatusFilter.COMPLETED:
          return todo.completed;
        case TodoStatusFilter.ACTIVE:
          return !todo.completed;

        default:
          throw new Error('Missing case in getFilteredTodos');
      }
    });
  }

  return filteredTodos;
};
