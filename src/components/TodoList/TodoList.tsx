import React from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';
import TodoItem from '../TodoItem';

type Props = {
  todos: Todo[],
  selectedFilter: string,
};

function filterTodos(todos: Todo[], selectedFilter: string) {
  switch (selectedFilter) {
    case Filter.active:
      return todos.filter(todo => !todo.completed);

    case Filter.completed:
      return todos.filter(todo => todo.completed);

    case Filter.all:
    default:
      return todos;
  }
}

export const TodoList: React.FC<Props> = ({
  todos, selectedFilter,
}) => {
  const filteredTodos = filterTodos(todos, selectedFilter);

  return (
    <section className="todoapp__main">
      {filteredTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </section>
  );
};
