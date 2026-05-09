import React from 'react';
import { Todo } from '../../types/todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingIds: number[];
  onDelete: (value: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingIds,
  onDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isLoading={loadingIds.includes(todo.id)}
        onDelete={onDelete}
      />
    ))}
    {tempTodo && <TodoItem todo={tempTodo} isLoading onDelete={onDelete} />}
  </section>
);
