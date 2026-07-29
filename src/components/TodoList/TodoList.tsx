/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  deletingIds: number[];
};

export const TodoList: React.FC<Props> = ({ todos, onDelete, deletingIds }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          isLoading={deletingIds.includes(todo.id)}
        />
      ))}
    </section>
  );
};
