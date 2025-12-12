import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  loadingIds: Set<string>;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
  tempTodo: Todo | null;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  loading,
  loadingIds,
  onToggle,
  onDelete,
  tempTodo,
}) => {
  const isEmpty = todos.length === 0;

  return (
    <section
      className={`todoapp__main ${isEmpty ? 'hidden' : ''} ${loading ? 'is-loading' : ''}`}
      data-cy="TodoList"
    >
      {loading && (
        <div className="global-loader" style={{ padding: '1rem' }}>
          Loading...
        </div>
      )}

      {!loading &&
        todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            loading={loadingIds.has(String(todo.id))}
            onToggle={() => onToggle(todo)}
            onDelete={() => onDelete(String(todo.id))}
          />
        ))}
      {tempTodo && (
        <TodoItem
          key={0}
          todo={tempTodo}
          loading={true}
          onToggle={() => {}}
          onDelete={() => {}}
        />
      )}
    </section>
  );
};
