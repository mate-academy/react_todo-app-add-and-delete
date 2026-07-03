import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  deletingIds: number[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  onToggle?: (todo: Todo) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  deletingIds,
  tempTodo,
  onDelete,
  onToggle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isProcessed={deletingIds.includes(todo.id)}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} isProcessed={true} />}
    </section>
  );
};
