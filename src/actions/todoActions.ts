import { Todo } from '../types/Todo';

export const addTodo = (todo: Todo) => {
  return {
    type: 'ADD_TODO',
    payload: todo,
  };
};

export const removeTodo = (id: number) => {
  return {
    type: 'REMOVE_TODO',
    payload: id,
  };
};
