import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  onDelete: (id: number) => Promise<void>;
  deletingIds: number[];
}

export const TodoList: React.FC<Props> = ({ todos, onDelete, deletingIds }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={deletingIds.includes(todo.id)}
        />
      ))}
    </section>
  );
};
