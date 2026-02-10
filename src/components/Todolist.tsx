import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  loadingIds: number[];
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  loadingIds,
  onToggle,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={loadingIds.includes(todo.id)}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};
