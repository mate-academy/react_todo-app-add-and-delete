import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete?: (id: number) => void;
  loadingIds?: number[];
};

export const TodoList: React.FC<Props> = ({ todos, onDelete, loadingIds }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={loadingIds?.includes(todo.id)}
        />
      ))}
    </section>
  );
};
