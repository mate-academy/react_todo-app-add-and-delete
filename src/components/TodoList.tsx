import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  deletingIds: Set<number>;
  onDelete: (todoId: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  visibleTodos,
  tempTodo,
  deletingIds,
  onDelete,
}) => {
  const hasAnyTodos = visibleTodos.length > 0 || tempTodo;

  if (!hasAnyTodos) {
    return null;
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={deletingIds.has(todo.id)}
          onDelete={onDelete}
        />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} isLoading isDeleteDisabled />}
    </section>
  );
};
