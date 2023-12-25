import { TodosFilterQuery } from '../constants';
import { Todo } from '../types/Todo';

const getPreparedTodos = (todos: Todo[], query: TodosFilterQuery) => {
  switch (query) {
    case TodosFilterQuery.active:
      return todos.filter(todo => !todo.completed);
    case TodosFilterQuery.completed:
      return todos.filter(todo => todo.completed);
    case TodosFilterQuery.all:
      return todos;
    default:
      return todos;
  }
};

export default getPreparedTodos;
