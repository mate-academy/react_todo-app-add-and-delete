import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from './types/Todo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo: (id: number) => Promise<void>;
  onToggleTodo: (id: number) => void;
  loadingIds: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  onToggleTodo,
  loadingIds,
}) => {
  const handleDelete = async (id: number) => {
    await onDeleteTodo(id);
  };

  const handleToggle = async (id: number) => {
    onToggleTodo(id);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={handleDelete}
          onToggle={handleToggle}
          loadingIds={loadingIds}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onDelete={handleDelete}
          onToggle={handleToggle}
          loadingIds={[tempTodo.id]}
        />
      )}
    </section>
  );
};
