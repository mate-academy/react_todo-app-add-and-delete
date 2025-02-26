import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './todo';

interface TodoListProps {
  filteredTodos: Todo[];
  isActive: number | undefined;
  isLoading: boolean;
  deleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  deletingTodoId: number | null;
}

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  isActive,
  deleteTodo,
  tempTodo,
  isLoading,
  deletingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          deletingTodoId={deletingTodoId}
          deleteTodo={deleteTodo}
          key={todo.id}
          todo={todo}
          isActive={isActive}
          isLoading={isLoading}
        />
      ))}
      {tempTodo && (
        <TodoItem
          deletingTodoId={deletingTodoId}
          key={tempTodo.id}
          todo={tempTodo}
          isLoading={isLoading}
          deleteTodo={() => {}}
          isActive={isActive}
        />
      )}
    </section>
  );
};
