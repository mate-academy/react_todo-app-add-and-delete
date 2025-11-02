import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  filteredTodos: Todo[];
  isAdding: boolean;
  isLoading: boolean;
  tempTodo: Todo | null;
  deletingIds: number[];
  onDeleteTodo: (todoId: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  isAdding,
  isLoading,
  tempTodo,
  deletingIds,
  onDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={isLoading}
          isDeleting={deletingIds.includes(todo.id)}
          onDelete={onDeleteTodo}
        />
      ))}

      {/* This todo is in loadind state */}
      {isAdding && tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isLoading={isAdding}
          isDeleting={false}
          onDelete={onDeleteTodo}
        />
      )}
    </section>
  );
};
