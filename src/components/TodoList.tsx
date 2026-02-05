import React from 'react';
import { Todo as TodoItem, TodoType } from './Todo';

interface TodoListProps {
  todos: TodoType[];
  loadingIds: number[];
  onDelete: (id: number) => void;
  onToggle?: (id: number, completed: boolean) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  loadingIds,
  onDelete,
  onToggle,
}) => {
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
          isLoading={loadingIds.includes(todo.id)}
        />
      ))}
    </ul>
  );
};
