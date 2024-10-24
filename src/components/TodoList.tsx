import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from '../components/TodoItem';

interface TodoListProps {
  todos: Todo[];
  onDelete: (todoId: number) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isDeleting: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDelete,
  isLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      ))}
    </section>
  );
};
