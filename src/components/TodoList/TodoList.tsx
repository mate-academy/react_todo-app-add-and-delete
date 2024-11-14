/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  onToggleTodo: (id: number) => void;
  onDelete: (todoId: number) => void;
  deletingId: number[];
  loading: boolean;
};

export const Todolist: React.FC<Props> = ({
  todos,
  onToggleTodo,
  onDelete,
  deletingId,
  loading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          onToggleTodo={onToggleTodo}
          onDelete={onDelete}
          deletingId={deletingId}
          loading={loading}
          key={todo.id}
        />
      ))}
    </section>
  );
};
