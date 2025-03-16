import { Filter } from '../enum/Filter';
import { Todo } from '../types/Todo';

export const filterTodos = (todoArr: Todo[], filter: Filter): Todo[] => {
  if (filter === Filter.Active) {
    return todoArr.filter(todo => !todo.completed);
  }

  if (filter === Filter.Completed) {
    return todoArr.filter(todo => todo.completed);
  }

  return todoArr;
};

export const notCompletedTodoCounter = (todos: Todo[]): number => {
  const notCompletedTodo = todos.filter(todo => !todo.completed);

  return notCompletedTodo.length;
};

export const completedTodoId = (todos: Todo[]) => {
  return todos.filter(todo => todo.completed).map(todo => todo.id);
};
