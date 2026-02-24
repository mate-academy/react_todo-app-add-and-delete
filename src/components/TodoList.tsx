/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  loadingIds: number[];
  tempTodo: Todo | null;
  onDeleteTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingIds,
  tempTodo,
  onDeleteTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isLoading={loadingIds.includes(todo.id)}
        onDeleteTodo={onDeleteTodo}
      />
    ))}
    {tempTodo && (
      <TodoItem todo={tempTodo} isLoading={true} onDeleteTodo={onDeleteTodo} />
    )}
  </section>
);
