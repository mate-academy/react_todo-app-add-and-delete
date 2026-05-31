import { Todo } from '../types/Todo';

export const filterTodos = (
  todos: Todo[],
  filter: keyof Todo,
  value: boolean,
) => {
  return todos.filter(todo => todo[filter] === value);
};
