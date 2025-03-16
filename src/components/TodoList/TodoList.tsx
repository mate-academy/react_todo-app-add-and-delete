import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  isLoading: boolean;
  tempTodo: Todo | null;
  handleDeleteTodo: (todoId: number) => Promise<void>;
  onToggle: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  handleDeleteTodo,
  onToggle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={handleDeleteTodo}
          onToggle={onToggle}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={{ ...tempTodo, isLoading: true }}
          onDelete={handleDeleteTodo}
          onToggle={onToggle}
        />
      )}
    </section>
  );
};
