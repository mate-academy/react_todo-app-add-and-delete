import React from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';

type Props = {
  filter: Filter;
  todos: Todo[];
  filterTodos: (value: Todo[] | ((prev: Todo[]) => Todo[])) => void;
  handleDelete: (todoId: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  filter,
  todos,
  filterTodos,
  handleDelete,
}) => {
  const filteredTodos = todos.filter((todo: Todo) => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  // eslint-disable-next-line max-len
  return filteredTodos.map((todo: Todo) => (
    <TodoItem
      key={todo.id}
      todo={todo}
      filterTodos={filterTodos}
      handleDelete={handleDelete}
    />
  ));
};
