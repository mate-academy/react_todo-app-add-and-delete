import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  loading: boolean;
  updatingTodoIds: number[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  toggleTodo,
  updatingTodoIds,
  onDelete,
  loading,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={toggleTodo}
          loading={loading}
          updatingTodoIds={updatingTodoIds}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onToggle={() => {}}
          loading={loading}
          updatingTodoIds={updatingTodoIds}
          onDelete={() => {}}
        />
      )}
    </section>
  );
};
