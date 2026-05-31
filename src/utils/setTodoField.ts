import { Todo } from '../types/Todo';

export const setFieldTodo = <K extends keyof Todo>(
  todo: Todo,
  field: K,
  value: Todo[K],
) => {
  let newValue = value;

  if (field === 'title' && typeof value === 'string') {
    newValue = value.trim() as Todo[K];
  }

  const changedTodo = {
    ...todo,
    [field]: newValue,
  };

  return changedTodo;
};
