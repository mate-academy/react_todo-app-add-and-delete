import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  handleToggleTodo: (todo: Todo) => void;
  handleDeleteTodo: (id: number) => void;
  deletingTodoId: number | null;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  handleToggleTodo,
  handleDeleteTodo,
  deletingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={deletingTodoId === todo.id}
          onToggle={() => handleToggleTodo(todo)}
          handleDelete={() => handleDeleteTodo(todo.id)}
        />
      ))}
    </section>
  );
};
