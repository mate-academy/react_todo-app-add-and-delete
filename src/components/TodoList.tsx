import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  onCompleted: (todo: Omit<Todo, 'userId'>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  tempTodo: Todo | null;
  loading: boolean;
  loadingId: number | number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  onCompleted,
  onDelete,
  tempTodo,
  loading,
  loadingId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          loadingId={loadingId}
          loading={loading}
          onCompleted={onCompleted}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={onDelete}
          loadingId={loadingId}
          loading={loading}
          onCompleted={onCompleted}
        />
      )}
    </section>
  );
};
