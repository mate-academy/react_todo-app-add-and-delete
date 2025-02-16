import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filterparam: string): Todo[] => {
  let resultTodos = [...todos];

  if (filterparam === 'active') {
    resultTodos = resultTodos.filter(todo => todo.completed !== true);
  }

  if (filterparam === 'completed') {
    resultTodos = resultTodos.filter(todo => todo.completed === true);
  }

  return resultTodos;
};
