import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingIds: number[];
  onDelete: (id: number) => void;
  onUpdate: (todo: Todo) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  loadingIds,
  onDelete,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={loadingIds.includes(todo.id)}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={loadingIds.includes(tempTodo.id)}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      )}
    </section>
  );
};
