import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoSectionProps {
  todos: Todo[];
  handleDeleteTodo: (id: number) => void;
  deletingTodoId: number | null;
  tempTodo: Todo | null;
}

export const TodoSection: React.FC<TodoSectionProps> = ({
  todos,
  handleDeleteTodo,
  deletingTodoId,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          handleDeleteTodo={handleDeleteTodo}
          isDeleting={deletingTodoId === todo.id}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          handleDeleteTodo={handleDeleteTodo}
          isDeleting={false}
          loading
        />
      )}
    </section>
  );
};
