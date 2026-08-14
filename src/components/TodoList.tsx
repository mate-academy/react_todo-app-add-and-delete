import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  onDelete: (id: number) => Promise<void>;
  deletingIds: number[];
  onUpdate: (todo: Todo) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  deletingIds,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={deletingIds.includes(todo.id)}
          onUpdate={onUpdate}
        />
      ))}
    </section>
  );
};
