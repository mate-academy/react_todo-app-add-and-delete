import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  filteredTodos: Todo[];
  loadingTodos: Record<number, boolean>;
  isActive: number | undefined;
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
}

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  loadingTodos,
  isActive,
  onDelete,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={!!loadingTodos[todo.id]}
          isActive={isActive}
          onDelete={onDelete}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          loading={true}
          isActive={isActive}
          onDelete={onDelete}
        />
      )}
    </section>
  );
};
