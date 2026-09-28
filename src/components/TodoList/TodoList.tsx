import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  deletingTodoIds: number[];
};
/* eslint-disable jsx-a11y/label-has-associated-control */
export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  deletingTodoIds,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isLoading={deletingTodoIds.includes(todo.id)}
        onDelete={onDelete}
      />
    ))}
  </section>
);
