import { Todo } from '../types/Todo';

export const getCompletedTodos = (arr: Todo[]): Todo[] => {
  return arr.filter(elem => elem.completed);
};

export const pause = () => new Promise(resolve => setTimeout(resolve, 300));
