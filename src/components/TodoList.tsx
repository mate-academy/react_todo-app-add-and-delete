import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingIds: number[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingIds,
  onDelete,
  onToggle,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isLoading={loadingIds.includes(todo.id)}
        onDelete={onDelete}
        onToggle={onToggle}
      />
    ))}

    {tempTodo && <TodoItem key={0} todo={tempTodo} isLoading />}
  </section>
);
