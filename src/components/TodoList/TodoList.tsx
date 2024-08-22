import { TodoCard } from '../TodoCard/TodoCard';

import TodosContext from '../../contexts/Todos/TodosContext';
import FilterContext from '../../contexts/Filter/FilterContext';

import { Todo } from '../../types';
import { Filter } from '../../enums';

function getFilteredTodos(todos: Todo[], filter: Filter) {
  switch (filter) {
    case Filter.All:
      return todos;
    case Filter.Active:
      return todos.filter(({ completed }) => !completed);
    case Filter.Completed:
      return todos.filter(({ completed }) => completed);
  }
}

export const TodoList = () => {
  const { todos, pendingTodo } = TodosContext.useState();
  const { filter } = FilterContext.useState();

  const todosToDisplay = getFilteredTodos(todos, filter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosToDisplay.map(todo => (
        <TodoCard key={todo.id} todo={todo} />
      ))}
      {pendingTodo && <TodoCard todo={pendingTodo} isPending />}
    </section>
  );
};
