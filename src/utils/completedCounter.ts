import { Todo } from '../types/Todo';

export const uncompletedCounter = (todos: Todo[]) => {
  return todos.reduce((counter, todo) => {
    let tempCounter = counter;

    if (!todo.completed) {
      tempCounter += 1;
    }

    return tempCounter;
  }, 0);
};
