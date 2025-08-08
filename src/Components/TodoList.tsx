import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  isLoading: boolean;
  deletingIds: number[];
  onDelete: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  deletingIds,
  onDelete,
  isLoading,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isLoading={isLoading || deletingIds.includes(todo.id)}
        onDelete={() => onDelete(todo.id)}
      />
    ))}
  </section>
);
