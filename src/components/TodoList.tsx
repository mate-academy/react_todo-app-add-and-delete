import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onDeleteFromServ: (id: number) => void;
  onError: (error: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  isLoading,
  onToggle,
  onDelete,
  onDeleteFromServ,
  onError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          {...todo}
          isLoading={isLoading}
          onToggle={onToggle}
          onDelete={onDelete}
          onDeleteFromServ={onDeleteFromServ}
          onError={onError}
        />
      ))}
    </section>
  );
};
